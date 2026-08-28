import { Prisma } from '@prisma/client';

import AppLogger from '../core/AppLogger.ts';
import { AccountType } from '../types/AccountType.ts';
import { ApplicationConfigType } from '../types/ApplicationConfigType.ts';
import { ApplicationInputType, ApplicationType } from '../types/ApplicationType.ts';
import { LinkType } from '../types/LinkType.ts';
import { RepositoryType } from '../types/RepositoryType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import AuditProvider from './AuditProvider.ts';
import DependencyProvider from './DependencyProvider.ts';
import EvolutionProvider from './EvolutionProvider.ts';
import KeywordProvider from './KeywordProvider.ts';
import { getPrismaClient } from './PrismaClient.ts';

const formatApplicationInput = (application: ApplicationInputType): ApplicationType => {
    const {
        _id,
        acronym,
        name,
        description,
        gitOrganization,
        gitUrl,
        gitWebUrl,
        productionLink,
        sonarqubeLink,
        sonarqubeToken,
        contactMail,
        codeQualityPlatformLink,
        ciPlatformLink,
        deploymentPlatformLink,
        dataDogApiKey,
        dataDogAppKey,
        dataDogUrl,
        dataDogMonitorId,
        auditFrequencyEnabled,
        auditFrequencyCron,
    } = application || {};
    return {
        _id,
        name,
        acronym,
        description,
        contactMail,
        // Left `undefined` when the input omits the field, so a partial update
        // (a script, a client on an older schema) does not silently disable an
        // application's scheduled audits and drop its cron.
        auditFrequencyEnabled:
            auditFrequencyEnabled === undefined ? undefined : !!auditFrequencyEnabled,
        auditFrequencyCron:
            auditFrequencyEnabled === undefined
                ? undefined
                : auditFrequencyEnabled
                  ? auditFrequencyCron || null
                  : null,
        repo: { webUrl: gitWebUrl, gitUrl, organization: gitOrganization },
        links: [
            { label: 'Application production url', value: productionLink, description: '' },
            {
                label: 'Application SonarQube url',
                value: sonarqubeLink,
                description: '',
            },
            {
                label: 'Application code quality platform url',
                value: codeQualityPlatformLink,
                description: '',
            },
            { label: 'Application CI/CD platform url', value: ciPlatformLink, description: '' },
            {
                label: 'Application deployment platform url',
                value: deploymentPlatformLink,
                description: '',
            },
        ]?.filter((item) => item?.value),
        configuration: {
            ...(dataDogApiKey && dataDogAppKey && dataDogUrl && dataDogMonitorId
                ? {
                      dataDog: {
                          apiKey: dataDogApiKey,
                          appKey: dataDogAppKey,
                          url: dataDogUrl,
                          monitorId: dataDogMonitorId,
                      },
                  }
                : {}),
            ...(sonarqubeToken ? { sonarqube: { token: sonarqubeToken } } : {}),
        },
    };
};

const toRepository = (repo: Prisma.JsonValue | null | undefined): RepositoryType | undefined => {
    if (!repo || typeof repo !== 'object' || Array.isArray(repo)) {
        return undefined;
    }

    return repo as unknown as RepositoryType;
};

const toLinks = (links: Prisma.JsonValue | null | undefined): LinkType[] | undefined => {
    if (!Array.isArray(links)) {
        return undefined;
    }

    return links as unknown as LinkType[];
};

const toConfiguration = (
    configuration: Prisma.JsonValue | null | undefined,
): ApplicationConfigType | undefined => {
    if (!configuration || typeof configuration !== 'object' || Array.isArray(configuration)) {
        return undefined;
    }

    return configuration as unknown as ApplicationConfigType;
};

const normalizeApplication = (application: {
    id: number;
    name: string;
    acronym: string;
    contactMail: string;
    description: string;
    repo: Prisma.JsonValue | null;
    configuration: Prisma.JsonValue | null;
    links: Prisma.JsonValue | null;
    auditFrequencyEnabled?: boolean;
    auditFrequencyCron?: string | null;
}) => {
    return {
        ...application,
        _id: application.id,
        repo: toRepository(application.repo),
        configuration: toConfiguration(application.configuration),
        links: toLinks(application.links),
    } as ApplicationType;
};

const buildWhereClause = async (
    { searchText, keywords }: SearchQueryType,
    user?: AccountType,
): Promise<Prisma.ApplicationWhereInput> => {
    let where: Prisma.ApplicationWhereInput = {};

    if (searchText) {
        where.OR = [
            { name: { contains: searchText, mode: 'insensitive' } },
            { acronym: { contains: searchText, mode: 'insensitive' } },
            { description: { contains: searchText, mode: 'insensitive' } },
            { contactMail: { contains: searchText, mode: 'insensitive' } },
        ];
    }

    if (keywords) {
        const appIds = await KeywordProvider.getApplicationsIdsByKeywords({ keywords });
        if (appIds?.length) {
            where = { ...where, id: { in: appIds } };
        }
    }

    // Restrict to user's assigned applications only for USER role; ADMIN and SUPERADMIN see all
    if (user && user.role === 'USER' && user.applications?.length) {
        where = { ...where, id: { in: user.applications } };
    }

    return where;
};

const createFormApplication = async (application: ApplicationInputType) => {
    try {
        const formApplication = formatApplicationInput(application);
        const created = await getPrismaClient().application.create({
            data: {
                name: formApplication.name!,
                acronym: formApplication.acronym!,
                contactMail: formApplication.contactMail!,
                description: formApplication.description!,
                repo: formApplication.repo
                    ? (formApplication.repo as unknown as Prisma.InputJsonValue)
                    : undefined,
                configuration: formApplication.configuration
                    ? (formApplication.configuration as unknown as Prisma.InputJsonValue)
                    : undefined,
                links: formApplication.links
                    ? (formApplication.links as unknown as Prisma.InputJsonValue)
                    : undefined,
                auditFrequencyEnabled: formApplication.auditFrequencyEnabled ?? false,
                auditFrequencyCron: formApplication.auditFrequencyCron ?? null,
            },
        });
        AppLogger.info('[ApplicationProvider - createFormApplication] created: ' + created.id);
        return normalizeApplication(created);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        AppLogger.error(
            `[ApplicationProvider - createFormApplication] Failed to create application - ${errorMessage}. Check for duplicate name (${formApplication.name}) or acronym (${formApplication.acronym}), or ensure all required fields are provided.`,
            error,
        );
        return null;
    }
};

const editFormApplication = async (application: ApplicationInputType) => {
    try {
        if (!application?._id) return null;
        const formApplication = formatApplicationInput(application);
        AppLogger.info(
            `[ApplicationProvider - editFormApplication] formApplication: ${formApplication?._id}`,
        );

        if (!formApplication?._id) {
            return null;
        }

        // Merge configuration with existing DB value so write-only fields (e.g. sonarqube token)
        // are not erased when the form is saved without re-entering them.
        const existing = await getPrismaClient().application.findUnique({
            where: { id: application._id },
        });
        if (existing?.configuration) {
            formApplication.configuration = {
                ...(existing.configuration as object),
                ...formApplication.configuration,
            };
        }

        await getPrismaClient().application.update({
            where: { id: application._id },
            data: {
                name: formApplication.name ?? undefined,
                acronym: formApplication.acronym ?? undefined,
                contactMail: formApplication.contactMail ?? undefined,
                description: formApplication.description ?? undefined,
                repo: formApplication.repo
                    ? (formApplication.repo as unknown as Prisma.InputJsonValue)
                    : undefined,
                configuration: formApplication.configuration
                    ? (formApplication.configuration as unknown as Prisma.InputJsonValue)
                    : undefined,
                links: formApplication.links
                    ? (formApplication.links as unknown as Prisma.InputJsonValue)
                    : undefined,
                auditFrequencyEnabled: formApplication.auditFrequencyEnabled ?? undefined,
                // `undefined` leaves the column untouched, `null` clears it: both
                // are meaningful here, so this must not collapse them.
                auditFrequencyCron: formApplication.auditFrequencyCron,
            },
        });
        return { _id: application._id };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        AppLogger.error(
            `[ApplicationProvider - editFormApplication] Failed to update application (ID: ${application?._id}) - ${errorMessage}. Check for duplicate name or acronym.`,
            error,
        );
        return null;
    }
};

const editApplication = async (application: ApplicationType) => {
    try {
        if (!application?._id) return null;
        await getPrismaClient().application.update({
            where: { id: application._id },
            data: {
                name: application.name ?? undefined,
                acronym: application.acronym ?? undefined,
                contactMail: application.contactMail ?? undefined,
                description: application.description ?? undefined,
                repo: application.repo
                    ? (application.repo as unknown as Prisma.InputJsonValue)
                    : undefined,
                configuration: application.configuration
                    ? (application.configuration as unknown as Prisma.InputJsonValue)
                    : undefined,
                links: application.links
                    ? (application.links as unknown as Prisma.InputJsonValue)
                    : undefined,
            },
        });
        return { _id: application._id };
    } catch (error) {
        AppLogger.error('[ApplicationProvider - editApplication] error: ', error);
        return null;
    }
};

const deleteApplication = async ({ _id }: ApplicationType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().application.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.error('[ApplicationProvider - deleteApplication] error: ', error);
    }
};

const deleteApplicationList = async () => {
    try {
        await getPrismaClient().application.deleteMany();
        return true;
    } catch (error) {
        AppLogger.error('[ApplicationProvider - deleteApplicationList] error: ', error);
        return false;
    }
};

const getApplicationDetailsInfoByParams = async ({ _id }: ApplicationType) => {
    try {
        if (!_id) return null;
        const application = await getPrismaClient().application.findUnique({ where: { id: _id } });
        if (!application) return null;
        return normalizeApplication(application);
    } catch (error) {
        AppLogger.error('[ApplicationProvider - getApplicationDetailsInfoByParams] error: ', error);
        return null;
    }
};

const getApplicationDetailsEvolutionsByParams = async ({ _id }: ApplicationType) => {
    try {
        if (!_id) return null;
        return EvolutionProvider.getEvolutionListByPageAndParams({ appId: _id });
    } catch (error) {
        AppLogger.info(
            '[ApplicationProvider - getApplicationDetailsEvolutionsByParams] error: ' + error,
        );
        return null;
    }
};

const getApplicationDetailsDependenciesByParams = async ({ _id }: ApplicationType) => {
    try {
        if (!_id) return null;
        return DependencyProvider.getDependencyListByPageAndParams({ appId: _id });
    } catch (error) {
        AppLogger.info(
            '[ApplicationProvider - getApplicationDetailsDependenciesByParams] error: ' + error,
        );
        return null;
    }
};

const getApplicationDetailsAuditReportsByParams = async ({ _id }: ApplicationType) => {
    try {
        if (!_id) return null;
        return AuditProvider.getAuditListByPageAndParams({ appId: _id });
    } catch (error) {
        AppLogger.info(
            '[ApplicationProvider - getApplicationDetailsAuditReportsByParams] error: ' + error,
        );
        return null;
    }
};

const getApplicationDetailsKeywordsByParams = async ({ _id }: ApplicationType) => {
    try {
        if (!_id) return null;
        return KeywordProvider.getKeywordListByPageAndParams({ appId: _id });
    } catch (error) {
        AppLogger.info(
            '[ApplicationProvider - getApplicationDetailsKeywordsByParams] error: ' + error,
        );
        return null;
    }
};

const getApplicationListByPageAndParams = async (
    { searchText, keywords, offset, limit }: SearchQueryType,
    user?: AccountType,
) => {
    try {
        const where = await buildWhereClause({ searchText, keywords }, user);
        const applications = await getPrismaClient().application.findMany({
            where,
            skip: offset ?? undefined,
            take: limit ?? undefined,
        });
        return applications.map((app) => normalizeApplication(app));
    } catch (error) {
        AppLogger.error('[ApplicationProvider - getApplicationListByPageAndParams] error: ', error);
        return [];
    }
};

const getApplicationTotalByParams = async (
    { searchText, keywords }: SearchQueryType,
    user: AccountType,
) => {
    try {
        const where = await buildWhereClause({ searchText, keywords }, user);
        const count = await getPrismaClient().application.count({ where });
        return count;
    } catch (error) {
        AppLogger.error('[ApplicationProvider - getApplicationTotalByParams] error: ', error);
        return 0;
    }
};

/**
 * Every application whose scheduled audits are enabled, with the cron to install.
 * The database is the source of truth for these schedules: the analyzer's job
 * schedulers live in Redis, which can be lost (no persistence guarantee, image
 * bump, flush) and can also drift when a schedule write failed at save time.
 *
 * Returns `null` — not an empty list — when the read fails, so a caller
 * reconciling Redis against this list cannot mistake an unreachable database for
 * "no application schedules audits" and delete every schedule.
 */
const getScheduledApplicationList = async () => {
    try {
        const applications = await getPrismaClient().application.findMany({
            where: { auditFrequencyEnabled: true, auditFrequencyCron: { not: null } },
            select: { id: true, auditFrequencyCron: true },
        });

        return applications
            .filter((application) => application.auditFrequencyCron?.length)
            .map((application) => ({
                _id: application.id,
                auditFrequencyCron: application.auditFrequencyCron as string,
            }));
    } catch (error) {
        AppLogger.error('[ApplicationProvider - getScheduledApplicationList] error: ', error);
        return null;
    }
};

const getApplicationStatsByParams = async ({ keywords }: SearchQueryType) => {
    try {
        return KeywordProvider.getKeywordsStatsByParams({ keywords });
    } catch (error) {
        AppLogger.error('[ApplicationProvider - getApplicationStatsByParams] error: ', error);
        return null;
    }
};

const ApplicationProvider = {
    createFormApplication,
    editFormApplication,
    editApplication,
    deleteApplication,
    deleteApplicationList,
    getApplicationDetailsInfoByParams,
    getApplicationDetailsEvolutionsByParams,
    getApplicationDetailsDependenciesByParams,
    getApplicationDetailsAuditReportsByParams,
    getApplicationDetailsKeywordsByParams,
    getApplicationListByPageAndParams,
    getApplicationTotalByParams,
    getApplicationStatsByParams,
    getScheduledApplicationList,
};

export default ApplicationProvider;

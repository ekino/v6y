import { FindOptions, Op, Sequelize } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { AccountType } from '../types/AccountType.ts';
import { ApplicationInputType, ApplicationType } from '../types/ApplicationType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import AuditProvider from './AuditProvider.ts';
import DependencyProvider from './DependencyProvider.ts';
import EvolutionProvider from './EvolutionProvider.ts';
import KeywordProvider from './KeywordProvider.ts';
import { ApplicationModelType } from './models/ApplicationModel.ts';

/**
 *  Build search query
 * @param searchText
 * @param keywords
 * @param offset
 * @param limit
 * @param where
 */
const buildSearchQuery = async ({
    searchText,
    offset,
    limit,
    keywords /*, where*/,
}: SearchQueryType) => {
    const queryOptions: FindOptions = {};

    if (offset) {
        queryOptions.offset = offset;
    }

    if (limit && limit > (offset || 0)) {
        queryOptions.limit = limit;
    }

    if (searchText) {
        queryOptions.where = {
            [Op.or]: [
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
                    [Op.like]: `%${searchText.toLowerCase()}%`,
                }),
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('acronym')), {
                    [Op.like]: `%${searchText.toLowerCase()}%`,
                }),
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('description')), {
                    [Op.like]: `%${searchText.toLowerCase()}%`,
                }),
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('contact_mail')), {
                    [Op.like]: `%${searchText.toLowerCase()}%`,
                }),
            ],
        };
    }

    if (keywords) {
        const appIds = await KeywordProvider.getApplicationsIdsByKeywords({ keywords });
        if (appIds?.length) {
            queryOptions.where = {
                ...queryOptions.where,
                _id: {
                    [Op.in]: appIds,
                },
            };
        }
    }

    return queryOptions;
};

/**
 * Format application input
 * @param application
 */
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
        contactMail,
        codeQualityPlatformLink,
        ciPlatformLink,
        deploymentPlatformLink,
        additionalProductionLinks,
        dataDogApiKey,
        dataDogAppKey,
        dataDogUrl,
        dataDogMonitorId,
    } = application || {};

    return {
        _id,
        name,
        acronym,
        description,
        contactMail,
        repo: { webUrl: gitWebUrl, gitUrl, organization: gitOrganization },
        links: [
            {
                label: 'Application production url',
                value: productionLink,
                description: '',
            },
            ...(additionalProductionLinks?.map((link, index) => ({
                label: `Additional production url (${index + 1})`,
                value: link,
                description: '',
            })) || []),
            {
                label: 'Application code quality platform url',
                value: codeQualityPlatformLink,
                description: '',
            },
            {
                label: 'Application CI/CD platform url',
                value: ciPlatformLink,
                description: '',
            },
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
        },
    };
};

/**
 * Create form application
 * @param application
 */
const createFormApplication = async (application: ApplicationInputType) => {
    try {
        const formApplication = formatApplicationInput(application);
        AppLogger.info(
            `[ApplicationProvider - createFormApplication] formApplication: ${formApplication?._id}`,
        );

        const createdApplication = await ApplicationModelType.create(formApplication);

        AppLogger.info(
            `[ApplicationProvider - createFormApplication] createdApplication: ${createdApplication?._id}`,
        );

        return createdApplication;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - createFormApplication] error: ${error}`);
        return null;
    }
};

/**
 * Edit form application
 * @param application
 */
const editFormApplication = async (application: ApplicationInputType) => {
    try {
        if (!application?._id) {
            return null;
        }

        const formApplication = formatApplicationInput(application);
        AppLogger.info(
            `[ApplicationProvider - editFormApplication] formApplication: ${formApplication?._id}`,
        );

        if (!formApplication?._id) {
            return null;
        }

        const editedApplication = await ApplicationModelType.update(formApplication, {
            where: {
                _id: application?._id,
            },
        });

        AppLogger.info(
            `[ApplicationProvider - editFormApplication] editedApplication: ${editedApplication?.[0]}`,
        );

        return {
            _id: application?._id,
        };
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - editFormApplication] error: ${error}`);
        return null;
    }
};

/**
 * Edit application
 * @param application
 */
const editApplication = async (application: ApplicationType) => {
    try {
        if (!application?._id) {
            return null;
        }

        const editedApplication = await ApplicationModelType.update(application, {
            where: {
                _id: application?._id,
            },
        });

        AppLogger.info(
            `[ApplicationProvider - editApplication] editedApplication: ${editedApplication?.[0]}`,
        );

        return {
            _id: application?._id,
        };
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - editApplication] error: ${error}`);
        return null;
    }
};

/**
 * Delete application
 * @param _id
 */
const deleteApplication = async ({ _id }: ApplicationType) => {
    try {
        AppLogger.info(`[ApplicationProvider - deleteApplication] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await ApplicationModelType.destroy({
            where: {
                _id,
            },
        });

        return {
            _id,
        };
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - deleteApplication] error:  ${error}`);
    }
};

/**
 * Delete application list
 */
const deleteApplicationList = async () => {
    try {
        await ApplicationModelType.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - deleteApplicationList] error:  ${error}`);
        return false;
    }
};

/**
 * Get application details info by params
 * @param _id
 */
const getApplicationDetailsInfoByParams = async ({ _id }: ApplicationType) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsByParams] _id: ${_id}`);

        if (!_id) {
            return null;
        }

        const application = (
            await ApplicationModelType.findOne({
                where: { _id },
            })
        )?.dataValues;

        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] application _id: ${application?._id}`,
        );

        if (!application?._id) {
            return null;
        }

        return application;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsByParams] error: ${error}`);
        return null;
    }
};

/**
 * Get application details evolutions by params
 * @param _id
 */
const getApplicationDetailsEvolutionsByParams = async ({ _id }: ApplicationType) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsEvolutionsByParams] _id: ${_id}`,
        );

        if (!_id) {
            return null;
        }

        const evolutions = await EvolutionProvider.getEvolutionListByPageAndParams({
            appId: _id,
        });

        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsEvolutionsByParams] evolutions: ${evolutions?.length}`,
        );

        return evolutions;
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsEvolutionsByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Get application details dependencies by params
 * @param _id
 */
const getApplicationDetailsDependenciesByParams = async ({ _id }: ApplicationType) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsDependenciesByParams] _id: ${_id}`,
        );

        if (!_id) {
            return null;
        }

        const dependencies = await DependencyProvider.getDependencyListByPageAndParams({
            appId: _id,
        });

        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsDependenciesByParams] dependencies: ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsDependenciesByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Get application details audit reports by params
 * @param _id
 */
const getApplicationDetailsAuditReportsByParams = async ({ _id }: ApplicationType) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsAuditReportsByParams] _id: ${_id}`,
        );

        if (!_id) {
            return null;
        }

        const auditReports = await AuditProvider.getAuditListByPageAndParams({
            appId: _id,
        });

        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsAuditReportsByParams] auditReports: ${auditReports?.length}`,
        );

        return auditReports;
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsAuditReportsByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Get application details keywords by params
 * @param _id
 */
const getApplicationDetailsKeywordsByParams = async ({ _id }: ApplicationType) => {
    try {
        AppLogger.info(`[ApplicationProvider - getApplicationDetailsKeywordsByParams] _id: ${_id}`);

        const keywords = await KeywordProvider.getKeywordListByPageAndParams({
            appId: _id,
        });

        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsKeywordsByParams] keywords: ${keywords?.length}`,
        );

        return keywords;
    } catch (error) {
        AppLogger.info(
            `[ApplicationProvider - getApplicationDetailsKeywordsByParams] error: ${error}`,
        );
        return null;
    }
};

/**
 * Get application list by page and params
 * @param searchText
 * @param keywords
 * @param offset
 * @param limit
 * @param where
 * @param user
 */
const getApplicationListByPageAndParams = async (
    { searchText, keywords, offset, limit, where }: SearchQueryType,
    user?: AccountType,
) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] keywords: ${keywords?.join(
                '\r\n',
            )}`,
        );
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] searchText: ${searchText}`,
        );
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] where: ${where}`);
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] offset: ${offset}`,
        );
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] limit: ${limit}`);

        const searchQuery = await buildSearchQuery({
            searchText,
            keywords,
            offset,
            limit,
            where,
        });

        if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN' && user?.applications?.length) {
            searchQuery.where = {
                ...searchQuery.where,
                _id: {
                    [Op.in]: user.applications,
                },
            };
        }

        const applications = await ApplicationModelType.findAll(searchQuery);
        AppLogger.info(
            `[ApplicationProvider - getApplicationListByPageAndParams] applications: ${applications?.length}`,
        );

        return applications?.map((application) => application?.dataValues) || [];
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationListByPageAndParams] error: ${error}`);
        return [];
    }
};

/**
 * Get application total by params
 * @param searchText
 * @param keywords
 * @param user
 */
const getApplicationTotalByParams = async (
    { searchText, keywords }: SearchQueryType,
    user: AccountType,
) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] searchText: ${searchText}`,
        );
        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] keywords: ${keywords?.join(
                '\r\n',
            )}`,
        );

        const searchQuery = await buildSearchQuery({ searchText, keywords });
        if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN' && user.applications?.length) {
            searchQuery.where = {
                ...searchQuery.where,
                _id: {
                    [Op.in]: user.applications,
                },
            };
        }
        const applicationsCount = await ApplicationModelType.count(searchQuery);

        AppLogger.info(
            `[ApplicationProvider - getApplicationTotalByParams] applicationsCount: ${applicationsCount}`,
        );

        return applicationsCount;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationTotalByParams] error: ${error}`);
        return 0;
    }
};

/**
 * Get application stats by params
 * @param keywords
 */
const getApplicationStatsByParams = async ({ keywords }: SearchQueryType) => {
    try {
        AppLogger.info(
            `[ApplicationProvider - getApplicationStatsByParams] keywords: ${keywords?.join(
                '\r\n',
            )}`,
        );

        const keywordStats = await KeywordProvider.getKeywordsStatsByParams({
            keywords,
        });
        AppLogger.info(
            `[ApplicationProvider - getApplicationStatsByParams] keywordStats: ${keywordStats?.length}`,
        );

        return keywordStats;
    } catch (error) {
        AppLogger.info(`[ApplicationProvider - getApplicationStatsByParams] error: ${error}`);
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
};

export default ApplicationProvider;

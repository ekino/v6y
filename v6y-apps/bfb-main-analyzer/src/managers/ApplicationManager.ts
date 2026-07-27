import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    AuditRunProvider,
    RepositoryApi,
    RepositoryBranchType,
} from '@v6y/core-logic';

import { buildDynamicReports, buildStaticReports } from './AuditManager.ts';

const { getRepositoryDetails, getRepositoryBranches } = RepositoryApi;

/**
 * Resolves the branches to analyze for an application, falling back to cached
 * branches (and finally default branch names) whenever repository metadata or
 * branch listing calls fail or return nothing usable.
 */
const resolveRepositoryBranches = async ({
    organization,
    gitRepositoryName,
    fallbackBranches,
    applicationName,
}: {
    organization?: string;
    gitRepositoryName?: string;
    fallbackBranches: RepositoryBranchType[];
    applicationName?: string;
}): Promise<RepositoryBranchType[]> => {
    let repositoryDetails;

    try {
        repositoryDetails = await getRepositoryDetails({
            organization,
            gitRepositoryName,
        });
    } catch (repoError) {
        AppLogger.warn(
            `[ApplicationManager - buildApplicationReports] Failed to fetch repository details for ${applicationName}: ${repoError}. Will use cached branches.`,
        );
    }

    if (!repositoryDetails?.id || repositoryDetails?.archived || repositoryDetails?.empty_repo) {
        AppLogger.warn(
            '[ApplicationManager - buildApplicationDetails] repository metadata unavailable, using cached branches only',
        );
        return fallbackBranches;
    }

    const { _links: repositoryLinks } = repositoryDetails;

    try {
        const fetchedBranches = await getRepositoryBranches({
            repoBranchesUrl: repositoryLinks?.repo_branches,
        });

        return fetchedBranches?.length ? fetchedBranches : fallbackBranches;
    } catch (branchError) {
        AppLogger.warn(
            `[ApplicationManager - buildApplicationReports] Failed to fetch branches for ${applicationName}: ${branchError}`,
        );
        return fallbackBranches;
    }
};

/**
 * Builds the application reports.
 * @param application
 */
const buildApplicationReports = async (application: ApplicationType) => {
    let auditRunId: string | undefined;

    try {
        if (
            !application?.name?.length ||
            !application?.acronym?.length ||
            !application?.contactMail?.length ||
            !application?.description?.length ||
            !application?.repo?.organization?.length ||
            !application?.repo?.gitUrl?.length
        ) {
            return false;
        }

        const { organization, gitUrl } = application.repo;
        const gitRepositoryName = gitUrl?.split('/')?.pop()?.replace('.git', '');

        const fallbackBranches = (application?.repo?.allBranches || [])
            .filter((branch) => branch?.length)
            .map((name) => ({ name }));

        let repositoryBranches = await resolveRepositoryBranches({
            organization,
            gitRepositoryName,
            fallbackBranches,
            applicationName: application.name,
        });

        // If no branches found, attempt to use default branch names
        if (!repositoryBranches?.length) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] No branches found for ${application.name}, attempting default branches (main/master)`,
            );
            repositoryBranches = [{ name: 'main' }, { name: 'master' }];
        }

        await ApplicationProvider.editApplication({
            ...application,
            repo: {
                ...application?.repo,
                allBranches: repositoryBranches.map((branch) => branch?.name),
            },
        });

        // Create AuditRun record for this scheduled analysis
        const auditRun = await AuditRunProvider.createAuditRun({
            appId: application._id!,
            branch: undefined, // Scheduled runs analyze all branches
            runStatus: 'pending',
            analysisTypes: ['static', 'dynamic', 'devops'],
        });

        if (auditRun?._id) {
            auditRunId = String(auditRun._id);
            AppLogger.info(
                `[ApplicationManager - buildApplicationReports] AuditRun created: ${auditRunId}`,
            );

            // Update status to in_progress
            await AuditRunProvider.updateAuditRunStatus({
                auditRunId: Number(auditRunId),
                runStatus: 'in_progress',
            });
        }

        AppLogger.info('[ApplicationManager - buildApplicationDetails] start of static analysis');

        const staticSuccess = await buildStaticReports({
            application,
            branches: repositoryBranches,
            auditRunId,
        });

        AppLogger.info('[ApplicationManager - buildApplicationDetails] end of static analysis');

        AppLogger.info('[ApplicationManager - buildApplicationDetails] start of dynamic analysis');

        const dynamicSuccess = await buildDynamicReports({
            application,
            auditRunId,
        });

        AppLogger.info('[ApplicationManager - buildApplicationDetails] end of dynamic analysis');

        // Update AuditRun status: completed only when every analysis type succeeded,
        // otherwise mark it failed so it doesn't stay stuck in in_progress forever.
        if (auditRunId) {
            if (staticSuccess && dynamicSuccess) {
                await AuditRunProvider.updateAuditRunStatus({
                    auditRunId: Number(auditRunId),
                    runStatus: 'completed',
                    completedAt: new Date(),
                });
                AppLogger.info(
                    `[ApplicationManager - buildApplicationReports] AuditRun completed: ${auditRunId}`,
                );
            } else {
                await AuditRunProvider.updateAuditRunStatus({
                    auditRunId: Number(auditRunId),
                    runStatus: 'failed',
                    completedAt: new Date(),
                    errorMessage: `Partial analysis failure (staticSuccess=${staticSuccess}, dynamicSuccess=${dynamicSuccess})`,
                });
                AppLogger.warn(
                    `[ApplicationManager - buildApplicationReports] AuditRun failed: ${auditRunId}`,
                );
            }
        }

        return true;
    } catch (error) {
        AppLogger.error('[ApplicationManager - buildApplicationDetails] error: ', error);

        // Update AuditRun status to error if it was created
        if (auditRunId) {
            await AuditRunProvider.updateAuditRunStatus({
                auditRunId: Number(auditRunId),
                runStatus: 'error',
                errorMessage: String(error),
            }).catch((updateErr) =>
                AppLogger.warn(
                    `[ApplicationManager - buildApplicationReports] Failed to update error status: ${updateErr}`,
                ),
            );
        }

        return false;
    }
};

/**
 * Builds the reports for a single application id.
 * @param applicationId
 */
const buildApplicationReportsById = async (applicationId: number) => {
    try {
        if (!applicationId) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application?._id) {
            AppLogger.info(
                `[ApplicationManager - buildApplicationReportsById] application not found: ${applicationId}`,
            );
            return false;
        }

        return buildApplicationReports(application as unknown as ApplicationType);
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildApplicationReportsById] error: ${error}`);
        return false;
    }
};

/**
 * Builds the application list.
 */
const buildApplicationList = async () => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationList] Fetching applications from database...',
        );
        const applications = await ApplicationProvider.getApplicationListByPageAndParams(
            {},
            { role: 'ADMIN' },
        );
        const appCount = applications?.length || 0;
        AppLogger.info(
            `[ApplicationManager - buildApplicationList] Found ${appCount} application(s) to process`,
        );

        if (!applications?.length) {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationList] No applications found in database',
            );
            return false;
        }

        AppLogger.info(
            `[ApplicationManager - buildApplicationList] Processing ${appCount} applications...`,
        );
        for (const application of applications) {
            AppLogger.info(
                `[ApplicationManager - buildApplicationList] Processing application: ${application.name}`,
            );
            await buildApplicationReports(application as unknown as ApplicationType);
        }

        AppLogger.info(
            '[ApplicationManager - buildApplicationList] ✅ All applications processed successfully',
        );
        return true;
    } catch (error) {
        AppLogger.error('[ApplicationManager - buildApplicationList] ❌ Error: ', error);
        return false;
    }
};

const ApplicationManager = {
    buildApplicationReportsById,
    buildApplicationList,
};

export default ApplicationManager;

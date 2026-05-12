import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    AuditRunProvider,
    RepositoryApi,
} from '@v6y/core-logic';

import { buildDynamicReports, buildStaticReports } from './AuditManager.ts';

const { getRepositoryDetails, getRepositoryBranches } = RepositoryApi;

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

        const repositoryDetails = await getRepositoryDetails({
            organization,
            gitRepositoryName,
        });

        if (
            !repositoryDetails?.id ||
            repositoryDetails?.archived ||
            repositoryDetails?.empty_repo
        ) {
            return false;
        }

        const { _links: repositoryLinks } = repositoryDetails;

        const repositoryBranches = await getRepositoryBranches({
            repoBranchesUrl: repositoryLinks?.repo_branches,
        });

        if (!repositoryBranches?.length) {
            return false;
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
            branch: null, // Scheduled runs analyze all branches
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
                auditRunId,
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

        // Update AuditRun status to completed
        if (auditRunId && staticSuccess && dynamicSuccess) {
            await AuditRunProvider.updateAuditRunStatus({
                auditRunId,
                runStatus: 'completed',
                completedAt: new Date(),
            });
            AppLogger.info(
                `[ApplicationManager - buildApplicationReports] AuditRun completed: ${auditRunId}`,
            );
        }

        return true;
    } catch (error) {
        AppLogger.error('[ApplicationManager - buildApplicationDetails] error: ', error);

        // Update AuditRun status to error if it was created
        if (auditRunId) {
            await AuditRunProvider.updateAuditRunStatus({
                auditRunId,
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
 * Builds the application list.
 */
const buildApplicationList = async () => {
    try {
        const applications = await ApplicationProvider.getApplicationListByPageAndParams(
            {},
            { role: 'ADMIN' },
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationList] applications: ',
            applications?.length,
        );

        if (!applications?.length) {
            return false;
        }

        for (const application of applications) {
            await buildApplicationReports(application);
        }

        return true;
    } catch (error) {
        AppLogger.info('[ApplicationManager - buildApplicationList] error: ', error);
        return false;
    }
};

const ApplicationManager = {
    buildApplicationList,
};

export default ApplicationManager;

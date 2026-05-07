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

        let repositoryDetails;
        let repositoryBranches: RepositoryBranchType[] = [];

        try {
            repositoryDetails = await getRepositoryDetails({
                organization,
                gitRepositoryName,
            });
        } catch (repoError) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] Failed to fetch repository details for ${application.name}: ${repoError}. Will use default branches.`,
            );
        }

        if (
            !repositoryDetails?.id ||
            repositoryDetails?.archived ||
            repositoryDetails?.empty_repo
        ) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] Repository check failed for ${application.name}, using default branches only.`,
            );
        } else {
            const { _links: repositoryLinks } = repositoryDetails;

            try {
                repositoryBranches =
                    (await getRepositoryBranches({
                        repoBranchesUrl: repositoryLinks?.repo_branches,
                    })) ?? [];
            } catch (branchError) {
                AppLogger.warn(
                    `[ApplicationManager - buildApplicationReports] Failed to fetch branches for ${application.name}: ${branchError}`,
                );
            }
        }

        // If no branches found, attempt to use default branch names
        if (!repositoryBranches?.length) {
            AppLogger.warn(
                `[ApplicationManager - buildApplicationReports] No branches found for ${application.name}, attempting default branches (main/master)`,
            );
            // Create default branch objects for main and master
            repositoryBranches = [{ name: 'main' }, { name: 'master' }];
        }

        const userBranchesToAudit = application.repo.branchesToAudit;

        let branchesToAudit;
        if (userBranchesToAudit?.length) {
            const matched = repositoryBranches.filter((branch) =>
                userBranchesToAudit.includes(branch?.name),
            );
            branchesToAudit = matched.length ? matched : [repositoryBranches[0]];
        } else {
            const defaultBranchName =
                repositoryDetails.default_branch || repositoryBranches[0]?.name;
            const defaultBranch = repositoryBranches.find(
                (branch) => branch?.name === defaultBranchName,
            );
            branchesToAudit = defaultBranch ? [defaultBranch] : [repositoryBranches[0]];
        }

        AppLogger.info(
            '[ApplicationManager - buildApplicationReports] auditing branches: ',
            branchesToAudit.map((b) => b?.name).join(', '),
        );

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
            branches: branchesToAudit,
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
                auditRunId: Number(auditRunId),
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
    buildApplicationReports,
    buildApplicationList,
};

export default ApplicationManager;

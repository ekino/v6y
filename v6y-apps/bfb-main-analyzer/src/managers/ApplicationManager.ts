import { AppLogger, ApplicationProvider, ApplicationType, RepositoryApi } from '@v6y/core-logic';

import { buildDynamicReports, buildStaticReports } from './AuditManager.ts';

const { getRepositoryDetails, getRepositoryBranches } = RepositoryApi;

/**
 * Builds the application reports.
 * @param application
 */
const buildApplicationReports = async (application: ApplicationType) => {
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
        let repositoryBranches = fallbackBranches;

        const repositoryDetails = await getRepositoryDetails({
            organization,
            gitRepositoryName,
        });

        if (
            repositoryDetails?.id &&
            !repositoryDetails?.archived &&
            !repositoryDetails?.empty_repo
        ) {
            const { _links: repositoryLinks } = repositoryDetails;

            const fetchedBranches = await getRepositoryBranches({
                repoBranchesUrl: repositoryLinks?.repo_branches,
            });

            if (fetchedBranches?.length) {
                repositoryBranches = fetchedBranches;
            }
        } else {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationDetails] repository metadata unavailable, using cached branches only',
            );
        }

        if (repositoryBranches?.length) {
            await ApplicationProvider.editApplication({
                ...application,
                repo: {
                    ...application?.repo,
                    allBranches: repositoryBranches.map((branch) => branch?.name),
                },
            });
        }

        AppLogger.info('[ApplicationManager - buildApplicationDetails] start of static analysis');

        if (repositoryBranches?.length) {
            await buildStaticReports({
                application,
                branches: repositoryBranches,
            });
        } else {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationDetails] static analysis skipped: no branches available',
            );
        }

        AppLogger.info('[ApplicationManager - buildApplicationDetails] end of static analysis');

        AppLogger.info('[ApplicationManager - buildApplicationDetails] start of dynamic analysis');

        await buildDynamicReports({
            application,
        });

        AppLogger.info('[ApplicationManager - buildApplicationDetails] end of dynamic analysis');

        return true;
    } catch (error) {
        AppLogger.error('[ApplicationManager - buildApplicationDetails] error: ', error);
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
            await buildApplicationReports(application as unknown as ApplicationType);
        }

        return true;
    } catch (error) {
        AppLogger.info('[ApplicationManager - buildApplicationList] error: ', error);
        return false;
    }
};

const ApplicationManager = {
    buildApplicationReportsById,
    buildApplicationList,
};

export default ApplicationManager;

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

        AppLogger.info('[ApplicationManager - buildApplicationDetails] start of static analysis');

        await buildStaticReports({
            application,
            branches: repositoryBranches,
        });

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

        // For testing, audit only the first application
        const firstApplication = applications[0];
        await buildApplicationReports(firstApplication);

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

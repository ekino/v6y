import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    RegistryManager,
    ZipUtils,
} from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';

const { getRepositoryDetails, getRepositoryBranches, prepareGitBranchZipConfig } = RegistryManager;

const { getCurrentConfig } = ServerConfig;
const { staticAuditorApiPath, dynamicAuditorApiPath } = getCurrentConfig() || {};

interface BuildApplicationBranchParams {
    name: string;
}

interface BuildApplicationParams {
    applicationId?: number;
    workspaceFolder?: string;
    application?: ApplicationType;
    branch?: BuildApplicationBranchParams;
    branches?: BuildApplicationBranchParams[];
}

/**
 * Builds the application backend by branch.
 * @param applicationId
 * @param workspaceFolder
 */
const buildApplicationBackendByBranch = async ({
    applicationId,
    workspaceFolder,
}: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] workspaceFolder: ',
            workspaceFolder,
        );
        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildApplicationBackendByBranch] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the application frontend by branch.
 * @param applicationId
 * @param workspaceFolder
 */
const buildApplicationFrontendByBranch = async ({
    applicationId,
    workspaceFolder,
}: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] workspaceFolder: ',
            workspaceFolder,
        );

        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] staticAuditorApiPath: ',
            staticAuditorApiPath,
        );

        await fetch(staticAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, workspaceFolder }),
        });

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildApplicationFrontendByBranch] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the application details by branch.
 * @param application
 * @param branch
 */
const buildApplicationDetailsByBranch = async ({ application, branch }: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] application: ',
            application,
        );
        AppLogger.info('[ApplicationManager - buildApplicationDetailsByBranch] branch: ', branch);
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] ZIP_BASE_DIR: ',
            process.env.ZIP_BASE_DIR,
        );

        if (!process.env.ZIP_BASE_DIR?.length) {
            return false;
        }

        const { zipSourceUrl, zipDestinationDir, zipFileName, zipBaseFileName, zipOptions } =
            prepareGitBranchZipConfig({
                zipBaseDir: process.env.ZIP_BASE_DIR,
                application,
                branchName: branch?.name || '',
            }) || {};

        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipSourceUrl: ',
            zipSourceUrl,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipDestinationDir: ',
            zipDestinationDir,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipFileName: ',
            zipFileName,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipBaseFileName: ',
            zipBaseFileName,
        );

        if (!zipSourceUrl?.length || !zipDestinationDir?.length || !zipFileName?.length) {
            return false;
        }

        const zipDownloadStatus = await ZipUtils.downloadZip({
            zipSourceUrl,
            zipDestinationDir,
            zipFileName,
            zipOptions,
        });
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] zipDownloadStatus: ',
            zipDownloadStatus,
        );

        if (!zipDownloadStatus) {
            return false;
        }

        const workspaceFolder = await ZipUtils.unZipFile({
            zipOriginalSourceDir: zipDestinationDir,
            zipOriginalFileName: zipFileName,
            zipNewSourceDir: zipBaseFileName,
        });
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] workspaceFolder: ',
            workspaceFolder,
        );

        if (!workspaceFolder) {
            return false;
        }

        await buildApplicationFrontendByBranch({
            applicationId: application?._id,
            workspaceFolder,
        });

        await buildApplicationBackendByBranch({
            applicationId: application?._id,
            workspaceFolder,
        });

        ZipUtils.deleteZip({
            zipDirFullPath: zipDestinationDir,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildApplicationDetailsByBranch] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the static reports.
 * @param application
 * @param branches
 */
const buildStaticReports = async ({ application, branches }: BuildApplicationParams) => {
    try {
        AppLogger.info('[ApplicationManager - buildStaticReports] branches: ', branches?.length);
        AppLogger.info('[ApplicationManager - buildStaticReports] application: ', application);

        if (!branches?.length || !application) {
            return false;
        }

        for (const branch of branches) {
            AppLogger.info('[ApplicationManager - buildStaticReports] branch: ', branch);

            await buildApplicationDetailsByBranch({
                application,
                branch,
            });
        }

        return true;
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildStaticReports] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the dynamic reports.
 * @param application
 */
const buildDynamicReports = async ({ application }: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildDynamicReports] application: ',
            application?._id,
        );

        if (!application) {
            return false;
        }

        AppLogger.info(
            '[ApplicationManager - buildDynamicReports] dynamicAuditorApiPath: ',
            dynamicAuditorApiPath,
        );

        await fetch(dynamicAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
                workspaceFolder: null,
            }),
        });
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildDynamicReports] error:  ${error}`);
        return false;
    }
};

/**
 * Builds the application reports.
 * @param application
 */
const buildApplicationReports = async (application: ApplicationType) => {
    try {
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] application name: ',
            application?.name,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] application acronym: ',
            application?.acronym,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] application contactMail: ',
            application?.contactMail,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] application description: ',
            application?.description,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] application repo organization: ',
            application?.repo?.organization,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] application repo gitUrl: ',
            application?.repo?.gitUrl,
        );

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
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] gitRepositoryName: ',
            gitRepositoryName,
        );

        const repositoryDetails = await getRepositoryDetails({
            organization,
            gitRepositoryName,
        });
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] repositoryDetails id: ',
            repositoryDetails?.id,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] repositoryDetails archived: ',
            repositoryDetails?.archived,
        );
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] repositoryDetails empty_repo: ',
            repositoryDetails?.empty_repo,
        );

        if (
            !repositoryDetails?.id ||
            repositoryDetails?.archived ||
            repositoryDetails?.empty_repo
        ) {
            return false;
        }

        const { _links: repositoryLinks } = repositoryDetails;
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] repo_branches: ',
            repositoryLinks?.repo_branches?.length,
        );

        const repositoryBranches = await getRepositoryBranches({
            repoBranchesUrl: repositoryLinks?.repo_branches,
        });
        AppLogger.info(
            '[ApplicationManager -  buildApplicationReports] repositoryBranches: ',
            repositoryBranches?.length,
        );

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
        AppLogger.info('[ApplicationManager - buildApplicationDetails] error: ', error);
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

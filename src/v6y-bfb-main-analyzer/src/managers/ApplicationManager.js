import { AppLogger, ApplicationProvider, RepositoryApi, ZipUtils } from '@v6y/commons';

import ServerConfig from '../config/ServerConfig.js';

const { getRepositoryDetails, getRepositoryBranches, prepareGitBranchZipConfig } = RepositoryApi;
const { getCurrentConfig } = ServerConfig;
const { frontendStaticAuditorApi, frontendDynamicAuditorApi } = getCurrentConfig() || {};
const ZIP_BASE_DIR = '../code-analysis-workspace';

/**
 * Builds the backend of an application based on a specific branch.
 *
 * @param {Object} options - The options object.
 * @param {string} options.applicationId - The ID of the application.
 * @param {string} options.workspaceFolder - The folder where the application code is located.
 * @returns {Promise<boolean>} True if the build was successful, false otherwise.
 */
const buildApplicationBackendByBranch = async ({ applicationId, workspaceFolder }) => {
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
        AppLogger.info(
            `[ApplicationManager - buildApplicationBackendByBranch] error:  ${error.message}`,
        );
        return false;
    }
};

/**
 * Builds the frontend of an application based on a specific branch and starts the frontend analyzer service.
 *
 * @param {Object} options - The options object.
 * @param {string} options.applicationId - The ID of the application.
 * @param {string} options.workspaceFolder - The folder where the application code is located.
 * @returns {Promise<boolean>} True if the build and analyzer start were successful, false otherwise.
 */
const buildApplicationFrontendByBranch = async ({ applicationId, workspaceFolder }) => {
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
            '[ApplicationManager - buildApplicationFrontendByBranch] frontendStaticAuditorApi: ',
            frontendStaticAuditorApi,
        );

        await fetch(frontendStaticAuditorApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, workspaceFolder }),
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] error:  ${error.message}`,
        );
        return false;
    }
};

/**
 * Builds the details of an application based on a specific branch, including downloading, unzipping,
 * and analyzing the code.
 *
 * @param {Object} options - The options object
 * @param {Object} options.application - The application object
 * @param {Object} options.branch - The branch object
 * @returns {Promise<boolean>} True if the build was successful, false otherwise
 */
const buildApplicationDetailsByBranch = async ({ application, branch }) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] application: ',
            application,
        );
        AppLogger.info('[ApplicationManager - buildApplicationDetailsByBranch] branch: ', branch);

        const { zipSourceUrl, zipDestinationDir, zipFileName, zipBaseFileName, zipOptions } =
            prepareGitBranchZipConfig({
                zipBaseDir: ZIP_BASE_DIR,
                application,
                branchName: branch?.name,
            });

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
            applicationId: application?.id,
            workspaceFolder,
        });

        ZipUtils.deleteZip({
            zipDirFullPath: zipDestinationDir,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByBranch] error:  ${error.message}`,
        );
        return false;
    }
};

/**
 * Builds the static reports for all branches of an application
 * @param {object} application
 * @param {Array} branches
 * @returns {Promise<boolean>}
 */
const buildStaticReports = async ({ application, branches }) => {
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
        AppLogger.info(`[ApplicationManager - buildStaticReports] error:  ${error.message}`);
        return false;
    }
};

/**
 * Build dynamic reports for an application
 * @param {object} application
 * @returns {Promise<boolean>}
 */
const buildDynamicReports = async ({ application }) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildDynamicReports] application: ',
            application?._id,
        );

        if (!application) {
            return false;
        }

        AppLogger.info(
            '[ApplicationManager - buildDynamicReports] frontendDynamicAuditorApi: ',
            frontendDynamicAuditorApi,
        );

        await fetch(frontendDynamicAuditorApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId: application?._id, workspaceFolder: null }),
        });
    } catch (error) {
        AppLogger.info(`[ApplicationManager - buildDynamicReports] error:  ${error.message}`);
        return false;
    }
};

/**
 * Builds application reports
 *
 * @param {Object} application The application object
 * @returns {Promise<boolean>} True if the build was successful, false otherwise
 */
const buildApplicationReports = async (application) => {
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

        const { organization, gitUrl } = application?.repo;
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
        AppLogger.info('[ApplicationManager - buildApplicationDetails] error: ', error);
        return false;
    }
};

/**
 * Builds the details for all applications in the system
 *
 * @param {Object} options Options for building the application list
 * @returns {Promise<boolean>} True if the build was successful for all applications, false otherwise
 */
const buildApplicationList = async (options) => {
    try {
        const applications = await ApplicationProvider.getApplicationListByPageAndParams({});
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

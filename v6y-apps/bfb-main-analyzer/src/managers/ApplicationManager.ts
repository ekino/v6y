import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    RepositoryApi,
    ZipUtils,
} from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';

const { getRepositoryDetails, getRepositoryBranches, prepareGitBranchZipConfig } = RepositoryApi;

const { currentConfig } = ServerConfig;
const { staticAuditorApiPath, dynamicAuditorApiPath, devopsAuditorApiPath } = currentConfig || {};
const ZIP_BASE_DIR = '../code-analysis-workspace';

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

    try {
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] Calling static auditor for applicationId: ${applicationId}`,
        );

        const response = await fetch(staticAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, workspaceFolder }),
        });

        const result = await response.text();
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor response status: ${response.status}`,
        );
        AppLogger.info(
            `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor response: ${result}`,
        );

        if (!response.ok) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor failed with status ${response.status}`,
            );
        }
    } catch (error) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationFrontendByBranch - staticAuditor] error:  ${error}`,
        );
    }

    return true;
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

        const { zipSourceUrl, zipDestinationDir, zipFileName, zipBaseFileName, zipOptions } =
            prepareGitBranchZipConfig({
                zipBaseDir: ZIP_BASE_DIR,
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
    AppLogger.info('[ApplicationManager - buildDynamicReports] application: ', application?._id);

    if (!application) {
        return false;
    }

    AppLogger.info(
        '[ApplicationManager - buildDynamicReports] dynamicAuditorApiPath: ',
        dynamicAuditorApiPath,
    );

    try {
        await fetch(dynamicAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
                workspaceFolder: null,
            }),
        });
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - dynamicAuditor] error:  ${error}`,
        );
    }

    try {
        await fetch(devopsAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
            }),
        });
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - devOpsAuditor] error:  ${error}`,
        );
    }

    return true;
};

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

/**
 * Builds application details by specific params (for triggered audits).
 * @param applicationId - The ID of the application to audit
 * @param branch - Optional specific branch to audit
 */
const buildApplicationDetailsByParams = async ({
    applicationId,
    branch,
}: {
    applicationId: number;
    branch?: { name: string };
}) => {
    try {
        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByParams] applicationId: ${applicationId}, branch: ${branch?.name}`,
        );

        // Get application details
        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByParams] application found: ${application?._id}`,
        );

        if (!application) {
            AppLogger.error(
                `[ApplicationManager - buildApplicationDetailsByParams] Application not found: ${applicationId}`,
            );
            return false;
        }

        // If specific branch is provided, audit only that branch
        if (branch?.name) {
            AppLogger.info(
                `[ApplicationManager - buildApplicationDetailsByParams] Auditing specific branch: ${branch.name}`,
            );

            // Run static analysis for the specific branch
            const staticResult = await buildStaticReports({
                application,
                branches: [branch],
            });

            AppLogger.info(
                `[ApplicationManager - buildApplicationDetailsByParams] Static analysis result: ${staticResult}`,
            );

            // Run dynamic analysis
            const dynamicResult = await buildDynamicReports({
                application,
            });

            AppLogger.info(
                `[ApplicationManager - buildApplicationDetailsByParams] Dynamic analysis result: ${dynamicResult}`,
            );

            return true;
        }

        // Otherwise, run full audit
        AppLogger.info(`[ApplicationManager - buildApplicationDetailsByParams] Running full audit`);
        const result = await buildApplicationReports(application);
        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByParams] Full audit result: ${result}`,
        );
        return result;
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildApplicationDetailsByParams] error: ${error}`);
        return false;
    }
};

const ApplicationManager = {
    buildApplicationList,
    buildApplicationDetailsByParams,
};

export default ApplicationManager;

import fs from 'fs-extra';

import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    AuditProvider,
    RepositoryApi,
    ZipUtils,
} from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';

const { getRepositoryDetails, getRepositoryBranches, prepareGitBranchZipConfig } = RepositoryApi;

const { currentConfig } = ServerConfig;
const { staticAuditorApiPath, dynamicAuditorApiPath, devopsAuditorApiPath } = currentConfig || {};
const ZIP_BASE_DIR = '../code-analysis-workspace';

/**
 * Checks if static audits exist for the application.
 * @param applicationId
 * @returns true if static audits found, false otherwise
 */
const checkForStaticAudits = async (applicationId: number | undefined): Promise<boolean> => {
    const audits = await AuditProvider.getAuditListByPageAndParams({ appId: applicationId });

    if (!audits?.length) {
        return false;
    }

    const staticAudits = audits.filter((audit) => audit.type === 'Code-Complexity');
    if (staticAudits.length > 0) {
        AppLogger.info(
            '[ApplicationManager - checkForStaticAudits] Static audits found:',
            staticAudits.length,
        );
        return true;
    }

    return false;
};

/**
 * Waits for static auditor to complete by polling for audit records.
 * @param applicationId
 * @param maxWaitTime Maximum time to wait in milliseconds
 */
const waitForStaticAuditCompletion = async (
    applicationId: number | undefined,
    maxWaitTime: number = 120000, // Increased to 120 seconds
) => {
    const pollInterval = 1000; // Check every 1 second
    const startTime = Date.now();
    let attempts = 0;

    while (Date.now() - startTime < maxWaitTime) {
        try {
            if (await checkForStaticAudits(applicationId)) {
                AppLogger.info(
                    `[ApplicationManager - waitForStaticAuditCompletion] Static audits found after ${Date.now() - startTime}ms`,
                );
                return true;
            }
            attempts++;
        } catch (error) {
            AppLogger.debug(
                `[ApplicationManager - waitForStaticAuditCompletion] Polling attempt ${attempts}...`,
                error,
            );
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    AppLogger.warn(
        `[ApplicationManager - waitForStaticAuditCompletion] Timeout waiting for static audits after ${attempts} attempts`,
    );
    return false;
};

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
            '[ApplicationManager - buildApplicationBackendByBranch] applicationId: ',
            applicationId,
        );
        AppLogger.info(
            '[ApplicationManager - buildApplicationBackendByBranch] workspaceFolder: ',
            workspaceFolder,
        );
        return true;
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildApplicationBackendByBranch] error:  ${error}`);
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
        '[ApplicationManager - buildApplicationFrontendByBranch] Starting static auditor for applicationId: ',
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
        const response = await fetch(staticAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId, workspaceFolder }),
        });

        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] Static auditor response status: ',
            response.status,
        );

        if (!response.ok) {
            const errorText = await response.text();
            AppLogger.error(
                `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor HTTP ${response.status}: ${errorText}`,
            );
            return false;
        }

        const responseData = await response.json();
        AppLogger.info(
            '[ApplicationManager - buildApplicationFrontendByBranch] Static auditor response: ',
            responseData,
        );
        return true;
    } catch (error) {
        AppLogger.error(
            `[ApplicationManager - buildApplicationFrontendByBranch] Static auditor request failed: ${String(error)}`,
        );
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

        // Clean up any existing zip files before downloading
        try {
            const zipPath = `${zipDestinationDir}/${zipFileName}`;
            if (fs.existsSync(zipPath)) {
                fs.removeSync(zipPath);
            }
            const tempZipPath = `${zipPath}-temp`;
            if (fs.existsSync(tempZipPath)) {
                fs.removeSync(tempZipPath);
            }
        } catch (error) {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationDetailsByBranch] Failed to clean zip files: ',
                error,
            );
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

        // Clean up any existing workspace folder before unzipping to avoid "dest already exists" errors
        const workspacePath = `${ZIP_BASE_DIR}/${zipBaseFileName}`;

        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] Cleaning up existing workspace at: ',
            workspacePath,
        );

        try {
            if (fs.existsSync(workspacePath)) {
                fs.removeSync(workspacePath);
                AppLogger.info(
                    '[ApplicationManager - buildApplicationDetailsByBranch] Workspace cleaned up successfully',
                );
            }
        } catch (error) {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationDetailsByBranch] Failed to clean workspace: ',
                error,
            );
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

        // Wait for static auditor to complete processing before deleting workspace
        // The auditor runs asynchronously in a worker thread and needs the files to exist
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] Waiting for static auditor to process files...',
        );
        const staticAuditSuccess = await waitForStaticAuditCompletion(application?._id, 180000); // Wait up to 3 minutes for auditor to complete

        if (!staticAuditSuccess) {
            AppLogger.warn(
                '[ApplicationManager - buildApplicationDetailsByBranch] Static auditor did not complete in time, proceeding with cleanup...',
            );
        } else {
            AppLogger.info(
                '[ApplicationManager - buildApplicationDetailsByBranch] Static auditor processing complete.',
            );
        }

        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] Deleting workspace...',
        );
        ZipUtils.deleteZip({
            zipDirFullPath: zipDestinationDir,
        });

        return true;
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildApplicationDetailsByBranch] error: ${error}`);
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

        // Use the main branch or the first branch for static analysis
        const mainBranch = branches.find((branch) => branch.name === 'main') || branches[0];
        AppLogger.info('[ApplicationManager - buildStaticReports] using branch: ', mainBranch.name);

        await buildApplicationDetailsByBranch({
            application,
            branch: mainBranch,
        });

        return true;
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildStaticReports] error:  ${String(error)}`);
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
        '[ApplicationManager - buildDynamicReports] devopsAuditorApiPath: ',
        devopsAuditorApiPath,
    );

    try {
        const response = await fetch(devopsAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - devOpsAuditor] error:  ${String(error)}`,
        );
    }

    AppLogger.info(
        '[ApplicationManager - buildDynamicReports] dynamicAuditorApiPath: ',
        dynamicAuditorApiPath,
    );

    try {
        const response = await fetch(dynamicAuditorApiPath as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicationId: application?._id,
                workspaceFolder: null,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - dynamicAuditor] error:  ${String(error)}`,
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

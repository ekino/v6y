import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import {
    AppLogger,
    ApplicationType,
    AuditProvider,
    RepositoryApi,
    ZipUtils,
} from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';
import { BuildApplicationParams } from './Types.js';

const ZIP_BASE_DIR = path.join(os.tmpdir(), 'v6y-code-analysis-workspace');

const { prepareGitBranchZipConfig } = RepositoryApi;

const { currentConfig } = ServerConfig;

const { staticAuditorApiPath } = currentConfig || {};

/**
 * Checks if static audits exist for the application.
 * @param applicationId
 * @returns true if static audits found, false otherwise
 */
export const checkForStaticAudits = async (applicationId: number | undefined): Promise<boolean> => {
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
 * Builds the application backend by branch.
 * @param applicationId
 * @param workspaceFolder
 */
export const buildApplicationBackendByBranch = async ({
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
export const buildApplicationFrontendByBranch = async ({
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
 * Prepares the zip configuration for a branch.
 */
const prepareBranchZipConfig = (application: ApplicationType, branchName: string) => {
    const config = prepareGitBranchZipConfig({
        zipBaseDir: ZIP_BASE_DIR,
        application,
        branchName,
    });
    if (!config || !config.zipBaseFileName) return null;
    return {
        ...config,
        workspacePath: path.resolve(ZIP_BASE_DIR, config.zipBaseFileName),
    };
};

/**
 * Downloads the branch zip file.
 */
const downloadBranchZip = async ({
    zipSourceUrl,
    zipDestinationDir,
    zipFileName,
    zipOptions,
}: {
    zipSourceUrl: string;
    zipDestinationDir: string;
    zipFileName: string;
    zipOptions?: Record<string, unknown>;
}) => {
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
    return zipDownloadStatus;
};

/**
 * Cleans up and extracts the branch zip file.
 */
const extractBranchZip = async (
    zipDestinationDir: string,
    zipFileName: string,
    workspacePath: string,
) => {
    // Check if zip file exists and is not empty
    const zipPath = path.resolve(zipDestinationDir, zipFileName);
    if (!fs.existsSync(zipPath)) {
        AppLogger.error(
            '[ApplicationManager - buildApplicationDetailsByBranch] Zip file not found after download',
        );
        return false;
    }
    const stats = fs.statSync(zipPath);
    if (stats.size === 0) {
        AppLogger.error('[ApplicationManager - buildApplicationDetailsByBranch] Zip file is empty');
        return false;
    }

    // Clean up any existing workspace folder before unzipping to avoid "dest already exists" errors
    AppLogger.info(
        '[ApplicationManager - buildApplicationDetailsByBranch] Cleaning up existing workspace at: ',
        workspacePath,
    );

    try {
        if (fs.existsSync(workspacePath)) {
            AppLogger.info(
                '[ApplicationManager - buildApplicationDetailsByBranch] Removing existing workspace: ',
                workspacePath,
            );
            fs.removeSync(workspacePath);
            AppLogger.info(
                '[ApplicationManager - buildApplicationDetailsByBranch] Workspace cleaned up successfully',
            );
        } else {
            AppLogger.info(
                '[ApplicationManager - buildApplicationDetailsByBranch] Workspace does not exist: ',
                workspacePath,
            );
        }
    } catch (error) {
        AppLogger.warn(
            '[ApplicationManager - buildApplicationDetailsByBranch] Failed to clean workspace: ',
            error,
        );
    }

    const resolvedDest = path.resolve(zipDestinationDir);
    const resolvedTarget = workspacePath;
    const relativeTarget = path.relative(resolvedDest, resolvedTarget);

    const workspaceFolder = await ZipUtils.unZipFile({
        zipOriginalSourceDir: zipDestinationDir,
        zipOriginalFileName: zipFileName,
        zipNewSourceDir: relativeTarget,
    });
    AppLogger.info(
        '[ApplicationManager - buildApplicationDetailsByBranch] workspaceFolder: ',
        workspaceFolder,
    );

    return workspaceFolder;
};

/**
 * Triggers the static auditors for the branch.
 */
const triggerStaticAuditors = async (applicationId: number, workspaceFolder: string) => {
    await buildApplicationFrontendByBranch({
        applicationId,
        workspaceFolder,
    });

    await buildApplicationBackendByBranch({
        applicationId,
        workspaceFolder,
    });
};

/**
 * Builds the application details by branch.
 * @param application
 * @param branch
 */
export const buildApplicationDetailsByBranch = async ({
    application,
    branch,
}: BuildApplicationParams) => {
    try {
        AppLogger.info(
            '[ApplicationManager - buildApplicationDetailsByBranch] application: ',
            application,
        );
        AppLogger.info('[ApplicationManager - buildApplicationDetailsByBranch] branch: ', branch);

        if (!application) return false;

        const config = prepareBranchZipConfig(application, branch?.name || '');
        if (!config) return false;
        if (
            !config.zipSourceUrl?.length ||
            !config.zipDestinationDir?.length ||
            !config.zipFileName?.length ||
            !config.zipBaseFileName?.length
        ) {
            return false;
        }

        const downloadSuccess = await downloadBranchZip({
            zipSourceUrl: config.zipSourceUrl,
            zipDestinationDir: config.zipDestinationDir,
            zipFileName: config.zipFileName,
            zipOptions: config.zipOptions,
        });
        if (!downloadSuccess) {
            return false;
        }

        const workspaceFolder = await extractBranchZip(
            config.zipDestinationDir,
            config.zipFileName,
            config.workspacePath,
        );
        if (!workspaceFolder) {
            return false;
        }

        await triggerStaticAuditors(application._id, workspaceFolder!);

        return true;
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildApplicationDetailsByBranch] error: ${error}`);
        return false;
    }
};

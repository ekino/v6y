import { AppLogger } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';
import { buildApplicationDetailsByBranch } from './BranchManager.ts';
import { BuildApplicationBranchParams, BuildApplicationParams } from './Types.js';

const { currentConfig } = ServerConfig;

const { dynamicAuditorApiPath, devopsAuditorApiPath } = currentConfig || {};

/**
 * Builds the static reports.
 * @param application
 * @param branches
 */
export const buildStaticReports = async ({ application, branches }: BuildApplicationParams) => {
    try {
        AppLogger.info('[ApplicationManager - buildStaticReports] branches: ', branches?.length);
        AppLogger.info('[ApplicationManager - buildStaticReports] application: ', application);

        if (!branches?.length || !application) {
            return false;
        }

        // Use the main branch or the first branch for static analysis
        const mainBranch =
            branches.find((branch: BuildApplicationBranchParams) => branch.name === 'main') ||
            branches[0];
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
export const buildDynamicReports = async ({ application }: BuildApplicationParams) => {
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

import { AppLogger } from '@v6y/core-logic';

import ServerConfig from '../config/ServerConfig.ts';
import { buildApplicationDetailsByBranch } from './BranchManager.ts';
import { BuildApplicationParams } from './Types.js';

const { currentConfig } = ServerConfig;

const { dynamicAuditorApiPath, devopsAuditorApiPath } = currentConfig || {};

/**
 * Builds the static reports.
 * @param application
 * @param branches
 * @param auditRunId
 */
export const buildStaticReports = async ({
    application,
    branches,
    auditRunId,
}: BuildApplicationParams) => {
    try {
        AppLogger.info('[ApplicationManager - buildStaticReports] branches: ', branches?.length);
        AppLogger.info('[ApplicationManager - buildStaticReports] application: ', application);
        AppLogger.info('[ApplicationManager - buildStaticReports] auditRunId: ', auditRunId);

        if (!branches?.length || !application) {
            return false;
        }

        for (const branch of branches) {
            AppLogger.info('[ApplicationManager - buildStaticReports] branch: ', branch);

            await buildApplicationDetailsByBranch({
                application,
                branch,
                auditRunId,
            });
        }

        return true;
    } catch (error) {
        AppLogger.error(`[ApplicationManager - buildStaticReports] error:  ${String(error)}`);
        return false;
    }
};

/**
 * Builds the dynamic reports.
 * @param application
 * @param auditRunId
 */
export const buildDynamicReports = async ({ application, auditRunId }: BuildApplicationParams) => {
    AppLogger.info('[ApplicationManager - buildDynamicReports] application: ', application?._id);
    AppLogger.info('[ApplicationManager - buildDynamicReports] auditRunId: ', auditRunId);

    if (!application) {
        return false;
    }

    let devOpsSuccess = true;
    let dynamicSuccess = true;

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
                auditRunId,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        devOpsSuccess = false;
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
                auditRunId,
                workspaceFolder: null,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        dynamicSuccess = false;
        AppLogger.info(
            `[ApplicationManager - buildDynamicReports - dynamicAuditor] error:  ${String(error)}`,
        );
    }

    return devOpsSuccess && dynamicSuccess;
};

import { AppLogger, AuditType } from '@v6y/core-logic';
import { readdir } from 'fs/promises';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';

/**
 * Format bundle analyze reports.
 * @param applicationId
 * @param workspaceFolder
 */

const formatBundleAnalyzeReports = async ({
    applicationId,
    workspaceFolder,
}: AuditCommonsType): Promise<AuditType[] | null> => {
    try {
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] workspaceFolder:  ${workspaceFolder}`,
        );

        if (!applicationId || !workspaceFolder) {
            return [];
        }

        if (!workspaceFolder) {
            throw new Error('workspaceFolder is undefined');
        }
        const files = await readdir(workspaceFolder);
        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] the content of ${workspaceFolder}:`,
            files,
        );

        const packageManagers = {
            npm: 'package-lock.json',
            pnpm: 'pnpm-lock.yaml',
            yarn: 'yarn.lock',
        };

        function findPackageManager(files: string[], packageManagers: { [key: string]: string }) {
            for (const packageManager in packageManagers) {
                const lockFile = packageManagers[packageManager];
                if (Object.values(files).includes(lockFile)) {
                    return packageManager;
                }
            }
            return null;
        }

        const packageManager = findPackageManager(files, packageManagers);

        AppLogger.info(
            `[BundleAnalyzeUtils - formatBundleAnalyzeReports] packageManager:  ${packageManager}`,
        );

        const auditReports: AuditType[] = [];
        return auditReports;
    } catch (error) {
        AppLogger.info(`[BundleAnalyzeUtils - formatBundleAnalyzeReports] error:  ${error}`);
        return null;
    }
};

const BundleAnalyzeUtils = {
    formatBundleAnalyzeReports,
};

export default BundleAnalyzeUtils;

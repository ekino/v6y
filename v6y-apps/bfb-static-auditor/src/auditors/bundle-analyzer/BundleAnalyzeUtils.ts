import { AppLogger, AuditUtils } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';

const { getFrontendDirectories } = AuditUtils;

/**
 * Get the frontend bundler used in the project.
 * @param workspaceFolder
 * @param frontendModule
 */

const analyzeBundle = async (workspaceFolder: string) => {
    const frontendModules = getFrontendDirectories(workspaceFolder, []);
    if (!frontendModules.length) {
        AppLogger.warn(
            `[BundleAnalyzeUtils - analyzeBundle] frontendModule: No frontend modules found in the workspace.`,
        );
    } else {
        for (const frontendModule of frontendModules) {
            AppLogger.info(`[BundleAnalyzeUtils - analyzeBundle] frontendModule:`, frontendModule);
        }
    }
};

/**
 * Format bundle analyze reports.
 * @param applicationId
 * @param workspaceFolder
 */

const formatBundleAnalyzeReports = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
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

        const analyzeBundleReports = await analyzeBundle(workspaceFolder);

        return analyzeBundleReports;
    } catch (error) {
        AppLogger.error(`[BundleAnalyzeUtils - formatBundleAnalyzeReports] error:  ${error}`);
        return [];
    }
};

const BundleAnalyzeUtils = {
    formatBundleAnalyzeReports,
};

export default BundleAnalyzeUtils;

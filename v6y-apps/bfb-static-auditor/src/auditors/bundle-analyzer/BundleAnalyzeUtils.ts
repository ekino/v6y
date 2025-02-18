import { AppLogger, AuditType } from '@v6y/core-logic';

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

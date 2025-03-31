import { AppLogger } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import BundleAnalyzeUtils from './BundleAnalyzeUtils.ts';

/**
 * Start the auditor analysis
 * @param applicationId
 * @param workspaceFolder
 */

const { formatBundleAnalyzeReports } = BundleAnalyzeUtils;

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const auditReports = await formatBundleAnalyzeReports({ workspaceFolder, applicationId });
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] auditReports:  ${auditReports}`,
        );
    } catch (error) {
        AppLogger.error(
            '[BundleAnalyzeAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const BundleAnalyzeAuditor = {
    startAuditorAnalysis,
};

export default BundleAnalyzeAuditor;

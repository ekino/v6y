import { AppLogger, AuditProvider } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import BundleAnalyzeUtils from './BundleAnalyzeUtils.ts';

/**
 * Start the auditor analysis
 * @param applicationId
 * @param workspaceFolder
 */

const { startBundleAnalyzeReports } = BundleAnalyzeUtils;

const startAuditorAnalysis = async ({
    applicationId,
    workspaceFolder,
    auditRunId,
}: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(`[BundleAnalyzeAuditor - startAuditorAnalysis] auditRunId:  ${auditRunId}`);

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const auditReports = await startBundleAnalyzeReports({ workspaceFolder, applicationId });

        // Add auditRunId to each report
        if (auditRunId) {
            const auditRunIdNum =
                typeof auditRunId === 'string' ? parseInt(auditRunId, 10) : auditRunId;
            auditReports.forEach((audit) => {
                audit.auditRunId = auditRunIdNum;
            });
        }

        await AuditProvider.insertAuditList(auditReports);
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] audit reports inserted successfully`,
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

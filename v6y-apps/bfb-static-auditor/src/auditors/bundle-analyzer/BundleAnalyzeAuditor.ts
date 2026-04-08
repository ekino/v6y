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
    branchName,
}: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[BundleAnalyzeAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(`[BundleAnalyzeAuditor - startAuditorAnalysis] branchName:  ${branchName}`);

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const auditReports = await startBundleAnalyzeReports({
            workspaceFolder,
            applicationId,
            branchName,
        });

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

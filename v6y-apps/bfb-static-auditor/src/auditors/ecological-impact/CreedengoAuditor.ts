import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/core-logic';

import { CreedengoAuditType } from '../types/CreedengoAuditType.ts';
import CreedengoUtils from './CreedengoUtils.ts';

const { formatCreedengoReports } = CreedengoUtils;

/**
 * Start auditor analysis for ecological impact using Creedengo plugin
 * @param applicationId
 * @param workspaceFolder
 */
const startAuditorAnalysis = async ({ applicationId, workspaceFolder }: CreedengoAuditType) => {
    try {
        AppLogger.info(
            `[CreedengoAuditor - startAuditorAnalysis] Starting ecological impact analysis`,
        );
        AppLogger.info(
            `[CreedengoAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CreedengoAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            AppLogger.warn(
                `[CreedengoAuditor - startAuditorAnalysis] Missing applicationId or workspaceFolder, skipping analysis`,
            );
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });
        AppLogger.info(
            `[CreedengoAuditor - startAuditorAnalysis] Retrieved application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            AppLogger.warn(
                `[CreedengoAuditor - startAuditorAnalysis] Application not found with id: ${applicationId}`,
            );
            return false;
        }

        AppLogger.info(`[CreedengoAuditor - startAuditorAnalysis] Starting format reports`);
        const creedengoAuditReports = await formatCreedengoReports({
            application,
            workspaceFolder,
        });

        AppLogger.info(
            `[CreedengoAuditor - startAuditorAnalysis] Generated ${creedengoAuditReports.length} audit reports`,
        );

        if (creedengoAuditReports.length === 0) {
            AppLogger.info(`[CreedengoAuditor - startAuditorAnalysis] No reports to insert`);
            return true;
        }

        await AuditProvider.insertAuditList(creedengoAuditReports);

        AppLogger.info(
            `[CreedengoAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );
        return true;
    } catch (error) {
        AppLogger.error(
            '[CreedengoAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const CreedengoAuditor = {
    startAuditorAnalysis,
};

export default CreedengoAuditor;

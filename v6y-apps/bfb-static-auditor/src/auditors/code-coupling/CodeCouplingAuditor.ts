import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import CodeCouplingUtils from './CodeCouplingUtils.ts';

const { formatCodeCouplingReports } = CodeCouplingUtils;

/**
 * Start the auditor analysis
 * @param applicationId
 * @param workspaceFolder
 */
const startAuditorAnalysis = async ({
    applicationId,
    workspaceFolder,
    auditRunId,
}: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(`[CodeCouplingAuditor - startAuditorAnalysis] auditRunId:  ${auditRunId}`);

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const auditReports = await formatCodeCouplingReports({
            application,
            workspaceFolder,
        });

        if (!auditReports) {
            return false;
        }

        // Add appId and auditRunId to each report
        auditReports.forEach((audit) => {
            audit.appId = applicationId;
            if (auditRunId) {
                const auditRunIdNum =
                    typeof auditRunId === 'string' ? parseInt(auditRunId, 10) : auditRunId;
                audit.auditRunId = auditRunIdNum;
            }
        });

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );
        return true;
    } catch (error) {
        AppLogger.error(
            '[CodeCouplingAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const CodeCouplingAuditor = {
    startAuditorAnalysis,
};

export default CodeCouplingAuditor;

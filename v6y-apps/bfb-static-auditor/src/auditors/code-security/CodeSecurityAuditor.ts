import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import CodeSecurityUtils from './CodeSecurityUtils.ts';

const { formatCodeModularityReports } = CodeSecurityUtils;

/**
 * Start auditor analysis
 * @param applicationId
 * @param workspaceFolder
 */
const startAuditorAnalysis = async ({
    applicationId,
    workspaceFolder,
    branchName,
}: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[CodeSecurityAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeSecurityAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(`[CodeSecurityAuditor - startAuditorAnalysis] branchName:  ${branchName}`);

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });
        AppLogger.info(
            `[CodeSecurityAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[CodeSecurityAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const securityAuditReports = await formatCodeModularityReports({
            application,
            workspaceFolder,
            branchName,
        });

        await AuditProvider.insertAuditList(securityAuditReports);

        AppLogger.info(
            `[CodeModularityAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );
        return true;
    } catch (error) {
        AppLogger.error(
            '[CodeSecurityAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const CodeSecurityAuditor = {
    startAuditorAnalysis,
};

export default CodeSecurityAuditor;

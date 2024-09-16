import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';

import CodeSecurityUtils from './CodeSecurityUtils.js';

const { formatCodeModularityReports } = CodeSecurityUtils;

/**
 * Starts the auditor analysis for the given application and workspace folder.
 *
 * @param {Object} params - The parameters for the analysis.
 * @param {string} params.applicationId - The ID of the application to analyze.
 * @param {string} params.workspaceFolder - The workspace folder path.
 * @returns {Promise<boolean>} - Returns true if the analysis was successful, otherwise false.
 */
const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[CodeSecurityAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeSecurityAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
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

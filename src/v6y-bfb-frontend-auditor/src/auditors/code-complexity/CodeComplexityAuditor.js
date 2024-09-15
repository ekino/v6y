import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';

import CodeComplexityUtils from './CodeComplexityUtils.js';

const { formatCodeComplexityReports } = CodeComplexityUtils;

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (!applicationId?.length || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
        });

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const auditReports = formatCodeComplexityReports({ workspaceFolder, application }) || {};
        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] auditReports:  ${auditReports?.length}`,
        );

        if (!auditReports?.length) {
            return false;
        }

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );
        return true;
    } catch (error) {
        AppLogger.error(
            '[CodeComplexityAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const CodeComplexityAuditor = {
    startAuditorAnalysis,
};

export default CodeComplexityAuditor;

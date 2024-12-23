import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import CodeComplexityUtils from './CodeComplexityUtils.ts';

const { formatCodeComplexityReports } = CodeComplexityUtils;

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });
        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[CodeComplexityAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const auditReports = formatCodeComplexityReports({ workspaceFolder, application });
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

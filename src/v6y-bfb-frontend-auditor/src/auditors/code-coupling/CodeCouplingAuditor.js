import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';
import Madge from 'madge';

import CodeCouplingUtils from './CodeCouplingUtils.js';

const { formatCodeCouplingReports } = CodeCouplingUtils;

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
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

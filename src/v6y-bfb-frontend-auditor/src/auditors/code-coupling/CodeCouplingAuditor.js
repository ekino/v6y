import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';
import Madge from 'madge';

import CodeCouplingUtils from './CodeCouplingUtils.js';

const { formatCouplingReports } = CodeCouplingUtils;

const defaultOptions = {
    fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    excludeRegExp: [
        '.*node_modules/.*',
        '.*target/.*',
        '.*dist/.*',
        '.*__mocks__/.*',
        '.*husky/.*',
        '.*husky/.*',
        '.*vscode/.*',
        '.*idea/.*',
        '.*next/.*',
        '.*gitlab/.*',
        '.*github/.*',
        '.*eslint.*',
        '.*jest.*',
        '.*test.*',
        '.*babel.*',
        '.*webpack.*',
        '.*.config.*',
        '.*.types.*',
        '.*.svg',
        '.*.d.ts.*',
    ],
};

const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeCouplingAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
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
            `[CodeCouplingAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        const dependenciesParseResult = await Madge(workspaceFolder, defaultOptions);

        if (!dependenciesParseResult) {
            return {};
        }

        const auditReports = formatCouplingReports({
            application,
            workspaceFolder,
            dependenciesTree: dependenciesParseResult.obj(),
            circular: dependenciesParseResult.circular(),
            circularGraph: dependenciesParseResult.circularGraph(),
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

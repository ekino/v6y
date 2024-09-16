import { AppLogger, ApplicationProvider, AuditProvider, AuditUtils } from '@v6y/commons';
import { execSync } from 'child_process';

import CodeDuplicationUtils from './CodeDuplicationUtils.js';

const { getFileContent, deleteAuditFile } = AuditUtils;

const { formatCodeDuplicationReports } = CodeDuplicationUtils;

/**
 * Starts the auditor analysis for code duplication.
 *
 * @param {Object} params - The parameters for the analysis.
 * @param {string} params.applicationId - The ID of the application.
 * @param {string} params.workspaceFolder - The path to the workspace folder.
 * @returns {Promise<boolean>} - Returns true if the analysis was successful, otherwise false.
 */
const defaultOptions = {
    mode: 'strict',
    threshold: 0,
    format: ['javascript', 'typescript', 'jsx', 'tsx'],
    ignore: [
        '**/node_modules/**',
        '**/target/**',
        '**/dist/**',
        '**/__mocks__/*',
        '**/mocks/*',
        '**/.husky/**',
        '**/.vscode/.*',
        '**/.idea/**',
        '**/.gitlab/**',
        '**/.github/**',
        '**/eslint-config/**',
        '**/jest-config/**',
        '**/tailwind-config/**',
        '**/typescript-config/**',
        '**/.eslintrc.**',
        '**/.gitlab-ci.**',
        '**/tailwind.**',
        '**/tsconfig.json',
        '**/turbo.json',
        '**/jest.**',
        '**/__test__/**',
        '**/**test.**',
        '**/**.config.**',
        '**/webpack/**',
        '**/**webpack**',
        '**/next**.**',
        '**/.next/**',
        'babel',
        '.*.d.ts.*',
    ],
};

/**
 * Starts the auditor analysis for code duplication.
 *
 * @param {Object} params - The parameters for the analysis.
 * @param {string} params.applicationId - The ID of the application.
 * @param {string} params.workspaceFolder - The path to the workspace folder.
 * @returns {Promise<boolean>} - Returns true if the analysis was successful, otherwise false.
 */
const startAuditorAnalysis = async ({ applicationId, workspaceFolder }) => {
    try {
        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] workspaceFolder:  ${workspaceFolder}`,
        );

        if (applicationId === undefined || !workspaceFolder?.length) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsByParams({
            appId: applicationId,
        });
        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        // add jscpd if not installed
        execSync('npm i -g jscpd@4.0.4', { stdio: 'ignore' });

        // execute audit
        const codeDuplicationCommand = `jscpd --silent --mode "${defaultOptions.mode}" --threshold ${defaultOptions.threshold} --reporters "json" --output "${workspaceFolder}" --format "${defaultOptions.format}" --ignore "${defaultOptions.ignore.join(',')}" ${workspaceFolder}`;
        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] jscpd script:  ${codeDuplicationCommand}`,
        );

        // generate report
        try {
            execSync(codeDuplicationCommand, { stdio: 'ignore' }).toString();
        } catch (error) {
            AppLogger.info(
                `[CodeDuplicationAuditor - startAuditorAnalysis] execSync error:  ${error.message}`,
            );
        }

        const jscpdReportFilePath = `${workspaceFolder}/jscpd-report.json`;
        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] jscpdReportFilePath:  ${jscpdReportFilePath}`,
        );

        const jscpdFileAnalysisResult = await getFileContent(jscpdReportFilePath);
        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] jscpdFileAnalysisResult:  ${jscpdFileAnalysisResult?.length}`,
        );

        if (!jscpdFileAnalysisResult?.length) {
            return false;
        }

        deleteAuditFile({ fileFullPath: jscpdReportFilePath });

        const jscpdFileAnalysisResultJson = JSON.parse(jscpdFileAnalysisResult);

        if (!jscpdFileAnalysisResultJson) {
            return false;
        }

        const auditReports = formatCodeDuplicationReports({
            application,
            workspaceFolder,
            duplicationTotalSummary: jscpdFileAnalysisResultJson?.statistics?.total,
            duplicationFiles: jscpdFileAnalysisResultJson?.duplicates,
        });

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );

        return true;
    } catch (error) {
        AppLogger.error(
            '[CodeDuplicationAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

const CodeDuplicationAuditor = {
    startAuditorAnalysis,
};

export default CodeDuplicationAuditor;

import { AppLogger, ApplicationProvider, AuditProvider, AuditUtils } from '@v6y/commons';
import { execSync } from 'child_process';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import CodeDuplicationUtils from './CodeDuplicationUtils.ts';

const { getFileContent, deleteAuditFile } = AuditUtils;

const { defaultOptions, formatCodeDuplicationReports } = CodeDuplicationUtils;

/**
 * Start code duplication analysis.
 * @param applicationId
 * @param workspaceFolder
 */
const startAuditorAnalysis = async ({ applicationId, workspaceFolder }: AuditCommonsType) => {
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

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
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
        const codeDuplicationCommand = `jscpd --silent --mode "${
            defaultOptions.mode
        }" --threshold ${
            defaultOptions.threshold
        } --reporters "json" --output "${workspaceFolder}" --format "${
            defaultOptions.format
        }" --ignore "${defaultOptions.ignore.join(',')}" ${workspaceFolder}`;

        AppLogger.info(
            `[CodeDuplicationAuditor - startAuditorAnalysis] jscpd script:  ${codeDuplicationCommand}`,
        );

        // generate report
        try {
            execSync(codeDuplicationCommand, { stdio: 'ignore' }).toString();
        } catch (error) {
            AppLogger.info(
                // @ts-expect-error TS(2571): Object is of type 'unknown'.
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

        deleteAuditFile({ filePath: '', fileFullPath: jscpdReportFilePath });

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

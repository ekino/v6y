import { AppLogger } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';

/**
 * Utility functions for code duplication analysis.
 */
const formatCodeDuplicationReports = ({
    application,
    workspaceFolder,
    duplicationTotalSummary,
    duplicationFiles,
}) => {
    try {
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] application:  ${application}`,
        );
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] duplicationTotalSummary:  ${duplicationTotalSummary}`,
        );
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] duplicationFiles:  ${duplicationFiles?.length}`,
        );

        if (!duplicationFiles?.length || !application || !workspaceFolder) {
            return [];
        }

        const auditReports = [];

        const module = {
            appId: application?._id,
            url: application?.repo?.webUrl,
            branch: workspaceFolder.split('/').pop(),
            path: '',
        };

        if (Object.keys(duplicationTotalSummary || {})?.length) {
            auditReports.push({
                type: 'Code-Duplication',
                category: 'code-duplication-percent',
                status:
                    duplicationTotalSummary?.percentage > 0 ? auditStatus.error : auditStatus.info,
                score: duplicationTotalSummary?.percentage,
                scoreUnit: '%',
                module: {
                    ...module,
                    path: workspaceFolder,
                },
            });
            auditReports.push({
                type: 'Code-Duplication',
                category: 'code-duplication-total-duplicated-lines',
                status:
                    duplicationTotalSummary?.duplicatedLines > 0
                        ? auditStatus.error
                        : auditStatus.info,
                score: duplicationTotalSummary?.duplicatedLines,
                scoreUnit: 'lines',
                module: {
                    ...module,
                    path: workspaceFolder,
                },
            });
            console.log('inside duplicationTotalSummary: ', duplicationTotalSummary);
        }

        for (const duplicationFile of duplicationFiles) {
            const { firstFile, secondFile, fragment, lines } = duplicationFile;
            if (!firstFile?.name?.length || !secondFile?.name?.length) {
                continue;
            }

            const duplicationPath = `${firstFile.name} (${firstFile.start} - ${firstFile.end}) <-> ${secondFile.name} (${secondFile.start} - ${secondFile.end})`;

            auditReports.push({
                type: 'Code-Duplication',
                category: 'code-duplication-file',
                status: auditStatus.error,
                score: lines,
                scoreUnit: 'lines',
                extraInfos: fragment,
                module: {
                    ...module,
                    path: duplicationPath,
                },
            });
        }

        return auditReports;
    } catch (error) {
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] error:  ${error.message}`,
        );
        return [];
    }
};

const CodeDuplicationUtils = {
    formatCodeDuplicationReports,
};

export default CodeDuplicationUtils;

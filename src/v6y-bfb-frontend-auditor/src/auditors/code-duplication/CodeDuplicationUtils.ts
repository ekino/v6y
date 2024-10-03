import { AppLogger, auditStatus } from '@v6y/commons';

import { CodeDuplicationAuditType } from '../types/CodeDuplicationAuditType.ts';

/**
 * Default options for code duplication analysis.
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
 * Utility functions for code duplication analysis.
 */
const formatCodeDuplicationReports = ({
    application,
    workspaceFolder,
    duplicationTotalSummary,
    duplicationFiles,
}: CodeDuplicationAuditType) => {
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
                    (duplicationTotalSummary?.percentage || 0) > 0
                        ? auditStatus.error
                        : auditStatus.info,
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
                    (duplicationTotalSummary?.duplicatedLines || 0) > 0
                        ? auditStatus.error
                        : auditStatus.info,
                score: duplicationTotalSummary?.duplicatedLines,
                scoreUnit: 'lines',
                module: {
                    ...module,
                    path: workspaceFolder,
                },
            });
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
        AppLogger.info(`[CodeDuplicationUtils - formatCodeDuplicationReports] error:  ${error}`);
        return [];
    }
};

const CodeDuplicationUtils = {
    defaultOptions,
    formatCodeDuplicationReports,
};

export default CodeDuplicationUtils;

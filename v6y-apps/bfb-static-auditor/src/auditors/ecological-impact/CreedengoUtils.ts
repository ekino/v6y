import { ESLint } from 'eslint';

import { AppLogger, AuditType, AuditUtils, auditStatus, scoreStatus } from '@v6y/core-logic';

import { CreedengoAuditType } from '../types/CreedengoAuditType.ts';

const { getFiles } = AuditUtils;

const defaultOptions = {
    fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    excludeRegExp: [
        /.*node_modules\/.*/,
        /.*target\/.*/,
        /.*dist\/.*/,
        /.*__mocks__\/.*/,
        /.*husky\/.*/,
        /.*vscode\/.*/,
        /.*idea\/.*/,
        /.*next\/.*/,
        /.*gitlab\/.*/,
        /.*github\/.*/,
        /.*eslint.*/,
        /.*jest.*/,
        /.*test.*/,
        /.*babel.*/,
        /.*webpack.*/,
        /.*\.config.*/,
        /.*\.types.*/,
        /.*\.svg/,
        /.*\.d\.ts.*/,
    ],
};

interface ProcessMessagesOptions {
    messages: Array<{
        ruleId: string | null;
        severity: number;
        message: string;
        line: number;
        column: number;
    }>;
    filePath: string;
    basePath: string;
    reports: AuditType[];
}

/**
 * Process ESLint messages and create audit reports for Creedengo ecological impact issues
 */
const processMessages = ({
    messages,
    filePath,
    basePath,
    reports,
}: ProcessMessagesOptions): void => {
    if (!messages || messages.length === 0) {
        return;
    }

    for (const message of messages) {
        const { ruleId, severity, message: messageText, line, column } = message;

        // Only process Creedengo rules
        if (!ruleId?.includes('@creedengo/')) {
            continue;
        }

        AppLogger.info(
            `[CreedengoUtils - processMessages] Found issue: ${ruleId} in ${filePath} at ${line}:${column}`,
        );

        const relativeFilePath = filePath.replace(basePath, '').replace(/^\//, '');
        const category = ruleId.replace('@creedengo/', '');

        const report: AuditType = {
            type: 'Ecological-Impact',
            category,
            auditStatus: auditStatus.success,
            scoreStatus: severity === 2 ? scoreStatus.error : scoreStatus.warning,
            score: 0,
            scoreUnit: '',
            extraInfos: JSON.stringify({
                file: relativeFilePath,
                line,
                column,
                message: messageText,
            }),
        };

        reports.push(report);
    }
};

/**
 * Format creedengo ecological impact reports
 * @param application
 * @param workspaceFolder
 */
const formatCreedengoReports = async ({
    application,
    workspaceFolder,
}: CreedengoAuditType): Promise<AuditType[]> => {
    try {
        AppLogger.info(
            `[CreedengoUtils - formatCreedengoReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(
            `[CreedengoUtils - formatCreedengoReports] application:  ${application?._id}`,
        );

        if (!application || !workspaceFolder) {
            AppLogger.warn(
                '[CreedengoUtils - formatCreedengoReports] Missing application or workspaceFolder',
            );
            return [];
        }

        const { files, basePath } = getFiles(workspaceFolder) || {};
        AppLogger.info(`[CreedengoUtils - formatCreedengoReports] files found:  ${files?.length}`);
        AppLogger.info(`[CreedengoUtils - formatCreedengoReports] basePath:  ${basePath}`);

        if (!files?.length) {
            AppLogger.warn('[CreedengoUtils - formatCreedengoReports] No files found in workspace');
            return [];
        }

        // Filter files to analyze
        const filesToAnalyze = files.filter((file) => {
            // Check if file matches the included extensions
            const matchesExtension = defaultOptions.fileExtensions.some((ext) =>
                file.endsWith(`.${ext}`),
            );

            // Check if file is excluded
            const isExcluded = defaultOptions.excludeRegExp.some((pattern) => pattern.test(file));

            return matchesExtension && !isExcluded;
        });

        AppLogger.info(
            `[CreedengoUtils - formatCreedengoReports] files to analyze:  ${filesToAnalyze.length}`,
        );

        if (!filesToAnalyze.length) {
            AppLogger.warn(
                '[CreedengoUtils - formatCreedengoReports] No matching files to analyze after filtering',
            );
        }

        const creedengoReports: AuditType[] = [];

        try {
            // Initialize ESLint with Creedengo plugin
            // Using the new flat config format for ESLint 10.0+
            const eslint = new ESLint({
                cwd: workspaceFolder,
                overrideConfigFile: true,
                baseConfig: {
                    languageOptions: {
                        ecmaVersion: 2020,
                        sourceType: 'module',
                    },
                    plugins: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        '@creedengo': (await import('@creedengo/eslint-plugin')) as any,
                    },
                    rules: {
                        '@creedengo/no-unrequired-resources': 'warn',
                        '@creedengo/no-process-overhead': 'warn',
                        '@creedengo/no-battery-drain': 'warn',
                        '@creedengo/no-memory-waste': 'warn',
                        '@creedengo/no-network-overhead': 'warn',
                    },
                },
            });

            AppLogger.info(
                '[CreedengoUtils - formatCreedengoReports] ESLint instance created successfully',
            );

            // Run ESLint on files
            const results = await eslint.lintFiles(filesToAnalyze);
            AppLogger.info(
                `[CreedengoUtils - formatCreedengoReports] ESLint analysis complete, results: ${results.length}`,
            );

            // Process results
            for (const result of results) {
                const { filePath, messages } = result;

                AppLogger.info(
                    `[CreedengoUtils - formatCreedengoReports] Processing file: ${filePath}, messages: ${messages?.length}`,
                );

                processMessages({
                    messages,
                    filePath,
                    basePath: basePath || '',
                    reports: creedengoReports,
                });
            }

            AppLogger.info(
                `[CreedengoUtils - formatCreedengoReports] Found ${creedengoReports.length} ecological impact issues`,
            );

            return creedengoReports;
        } catch (eslintError) {
            AppLogger.error(
                '[CreedengoUtils - formatCreedengoReports] ESLint error occurred:',
                eslintError,
            );
            // Return empty array on ESLint error, allowing the audit to continue
            return [];
        }

        return creedengoReports;
    } catch (error) {
        AppLogger.error(`[CreedengoUtils - formatCreedengoReports] Unexpected error:  ${error}`);
        return [];
    }
};

const CreedengoUtils = {
    formatCreedengoReports,
};

export default CreedengoUtils;

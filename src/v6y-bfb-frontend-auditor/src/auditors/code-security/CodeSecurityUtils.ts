import { AppLogger, AuditUtils } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.ts';
import { securityAntiPatterns } from '@v6y/commons/src/config/CodeSmellConfig.ts';

import { AuditCommonsType } from '../types/AuditCommonsType.js';

const { getFiles, parseFile, isNonCompliantFile } = AuditUtils;

const defaultOptions = {};

/**
 * Format code modularity reports
 * @param application
 * @param workspaceFolder
 */
const formatCodeModularityReports = async ({ application, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[CodeSecurityUtils - formatCodeModularityReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] application:  ${application}`,
        );
        if (!application || !workspaceFolder) {
            return [];
        }

        const { files, basePath } = getFiles(workspaceFolder) || {};
        AppLogger.info(
            `[CodeSecurityUtils - formatCodeModularityReports] files:  ${files?.length}`,
        );

        AppLogger.info(`[CodeSecurityUtils - formatCodeModularityReports] basePath:  ${basePath}`);
        if (!files?.length) {
            return [];
        }

        const securityAuditReports = [];
        const module = {
            appId: application?._id,
            url: application?.repo?.webUrl,
            branch: workspaceFolder.split('/').pop(),
            path: '',
        };

        for (const file of files) {
            const report = parseFile({ file, basePath, options: defaultOptions });
            if (!report) {
                continue;
            }

            const { source } = report;
            AppLogger.info(
                `[CodeSecurityUtils - formatCodeModularityReports] source:  ${source?.length}`,
            );
            if (!source?.length) {
                continue;
            }

            for (const securityAntiPattern of securityAntiPatterns) {
                const { antiPattern, category } = securityAntiPattern;
                AppLogger.info(
                    `[CodeSecurityUtils - formatCodeModularityReports] antiPattern:  ${antiPattern}`,
                );
                AppLogger.info(
                    `[CodeSecurityUtils - formatCodeModularityReports] category:  ${category}`,
                );
                // eslint-disable-next-line max-depth
                if (!antiPattern?.length || !category?.length) {
                    continue;
                }

                const nonCompliantStatus = await isNonCompliantFile(antiPattern, source);
                AppLogger.info(
                    `[CodeSecurityUtils - formatCodeModularityReports] nonCompliantStatus:  ${nonCompliantStatus}`,
                );

                // eslint-disable-next-line max-depth
                if (!nonCompliantStatus) {
                    continue;
                }

                securityAuditReports.push({
                    type: 'Code-Security',
                    category: category,
                    status: auditStatus.error,
                    score: null,
                    scoreUnit: '',
                    module: {
                        ...module,
                        path: file,
                    },
                });
            }
        }

        return securityAuditReports;
    } catch (error) {
        AppLogger.info(`[CodeSecurityUtils - formatCodeModularityReports] error:  ${error}`);
        return [];
    }
};

const CodeSecurityUtils = {
    formatCodeModularityReports,
};

export default CodeSecurityUtils;

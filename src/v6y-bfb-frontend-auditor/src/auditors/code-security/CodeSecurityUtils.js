import { AppLogger, AuditUtils } from '@v6y/commons';

import CodeSecurityConfig from './CodeSecurityConfig.js';

const { getFiles, parseFile, isNonCompliantFile } = AuditUtils;

const { SECURITY_ANTI_PATTERNS_TOKENS, formatSecurityAuditReport, formatCodeSecurityHtmlReport } =
    CodeSecurityConfig;

const CODE_SECURITY_OPTIONS = {};

/**
 * Inspects the source directory.
 * @param {Object} params - The parameters for the inspection.
 * @returns {Promise<*[]>} - Returns an object containing the overview report.
 */
const inspectDirectory = async ({ srcDir }) => {
    try {
        AppLogger.info(`[CodeSecurityUtils - inspectDirectory] srcDir:  ${srcDir}`);

        const { files, basePath } = getFiles(srcDir);
        AppLogger.info(`[CodeSecurityUtils - inspectDirectory] files:  ${files?.length}`);
        AppLogger.info(`[CodeSecurityUtils - inspectDirectory] basePath:  ${basePath}`);

        if (!files?.length) {
            return [];
        }

        const securityAuditReports = [];

        for (const file of files) {
            const report = parseFile(file, basePath, CODE_SECURITY_OPTIONS);
            if (!report) {
                continue;
            }

            const { source } = report;
            AppLogger.info(`[CodeSecurityUtils - inspectDirectory] source:  ${source?.length}`);
            if (!source?.length) {
                continue;
            }

            for (const antiPattern of SECURITY_ANTI_PATTERNS_TOKENS) {
                const nonCompliantStatus = await isNonCompliantFile(antiPattern, source);
                AppLogger.info(
                    `[CodeSecurityUtils - inspectDirectory] nonCompliantStatus:  ${nonCompliantStatus}`,
                );

                if (nonCompliantStatus !== true) {
                    continue;
                }

                const securityAuditReport = formatSecurityAuditReport({
                    fileName: file,
                    antiPattern,
                });

                AppLogger.info(
                    `[CodeSecurityUtils - inspectDirectory] securityAuditReport:  ${Object.keys(securityAuditReport || {}).join(',')}`,
                );

                if (!securityAuditReport) {
                    continue;
                }

                securityAuditReports.push(securityAuditReport);
            }
        }

        return securityAuditReports;
    } catch (error) {
        return [];
    }
};

const CodeSecurityUtils = {
    inspectDirectory,
};

export default CodeSecurityUtils;

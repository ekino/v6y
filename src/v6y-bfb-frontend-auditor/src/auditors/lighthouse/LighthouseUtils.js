import { AppLogger } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';
import Matcher from '@v6y/commons/src/core/Matcher.js';

/**
 * Helper function to check if an audit status indicates a failure.
 * @function isAuditFailed
 * @param {string} status - The audit status.
 * @returns {boolean} - True if the status is 'warning' or 'error'.
 */
const isAuditFailed = (status) => status === auditStatus.warning || status === auditStatus.error;

/**
 * Checks if an audit report indicates a performance failure.
 * @function isAuditPerformanceFailed
 * @param {Object} report - The audit report object.
 * @returns {boolean} - True if the audit report's category is 'performance' and its status is 'warning' or 'error'.
 */
const isAuditPerformanceFailed = (report) =>
    report.category === 'performance' && isAuditFailed(report.status);

/**
 * Checks if an audit report indicates an accessibility failure.
 * @function isAuditAccessibilityFailed
 * @param {Object} report - The audit report object.
 * @returns {boolean} - True if the audit report's category is 'accessibility' and its status is 'warning' or 'error'.
 */
const isAuditAccessibilityFailed = (report) =>
    report.category === 'accessibility' && isAuditFailed(report.status);

/**
 * Formats an audit category object.
 * @function formatAuditCategory
 * @param {Object} auditCategory - The audit category object.
 * @returns {Object|null} - The formatted audit category object or null if the input is invalid.
 */
const formatAuditCategory = (auditCategory) => {
    if (!auditCategory) return null;

    const { id, title, score, description } = auditCategory;

    const currentScore = score * 100;
    const status = Matcher()
        .on(
            () => currentScore < 50,
            () => auditStatus.error,
        )
        .on(
            () => currentScore > 50 && currentScore < 70,
            () => auditStatus.warning,
        )
        .on(
            () => currentScore > 70,
            () => auditStatus.success,
        )
        .otherwise(() => auditStatus.info);

    return {
        category: id,
        title,
        description,
        status,
        score: currentScore,
        scoreUnit: '%',
        branch: null,
    };
};

/**
 * Formats an audit metric object.
 * @function formatAuditMetric
 * @param {Object} auditMetric - The audit metric object.
 * @returns {Object|null} - The formatted audit metric object or null if the input is invalid.
 */
const formatAuditMetric = (auditMetric) => {
    if (!auditMetric) return null;

    const { id, title, description, numericValue, numericUnit } = auditMetric;

    const indicatorScore =
        (numericUnit !== 'unitless' ? (numericValue || 0) / 1000 : numericValue) || 0;

    const indicatorScoreUnit = numericUnit !== 'unitless' ? 's' : '';

    let indicatorStatus = null;

    if (id === 'largest-contentful-paint') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 2.5,
                () => auditStatus.success,
            )
            .on(
                () => indicatorScore >= 2.5 && indicatorScore < 4,
                () => auditStatus.warning,
            )
            .on(
                () => indicatorScore >= 4,
                () => auditStatus.error,
            )
            .otherwise(() => auditStatus.info);
    }

    if (id === 'first-contentful-paint') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 1.8,
                () => auditStatus.success,
            )
            .on(
                () => indicatorScore >= 1.8 && indicatorScore < 3,
                () => auditStatus.warning,
            )
            .on(
                () => indicatorScore >= 3,
                () => auditStatus.error,
            )
            .otherwise(() => auditStatus.info);
    }

    if (id === 'total-blocking-time') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 0.2,
                () => auditStatus.success,
            )
            .on(
                () => indicatorScore >= 0.2 && indicatorScore < 0.6,
                () => auditStatus.warning,
            )
            .on(
                () => indicatorScore >= 0.6,
                () => auditStatus.error,
            )
            .otherwise(() => auditStatus.info);
    }

    if (id === 'speed-index') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 3.4,
                () => auditStatus.success,
            )
            .on(
                () => indicatorScore >= 3.4 && indicatorScore < 5.8,
                () => auditStatus.warning,
            )
            .on(
                () => indicatorScore >= 5.8,
                () => auditStatus.error,
            )
            .otherwise(() => auditStatus.info);
    }

    if (id === 'cumulative-layout-shift') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 0.1,
                () => auditStatus.success,
            )
            .on(
                () => indicatorScore >= 0.1 && indicatorScore < 0.25,
                () => auditStatus.warning,
            )
            .on(
                () => indicatorScore >= 0.25,
                () => auditStatus.error,
            )
            .otherwise(() => auditStatus.info);
    }

    return {
        category: id,
        title: `${title || ''}`,
        status: indicatorStatus,
        description,
        score: indicatorScore.toFixed(2),
        scoreUnit: indicatorScoreUnit,
        branch: null,
    };
};

/**
 * Parses a Lighthouse audit report and extracts relevant data.
 * @function parseLighthouseAuditReport
 * @param {string} auditReportData - The raw audit report data as a JSON string.
 * @returns {Array} - An array of extracted audit results.
 */
const parseLighthouseAuditReport = (auditReportData) => {
    try {
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] data:  ${auditReportData?.length}`,
        );

        if (!auditReportData?.length) {
            return [];
        }

        const jsonData = JSON.parse(auditReportData);
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] jsonData:  ${Object.keys(jsonData)?.join?.(',')}`,
        );

        if (!jsonData || !Object.keys(jsonData)?.length) {
            return [];
        }

        const { categories, audits, runtimeError } = jsonData || {};

        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] runtimeError:  ${runtimeError?.code}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] categories:  ${Object.keys(categories)?.join?.(',')}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] audits:  ${Object.keys(audits)?.join?.(',')}`,
        );

        if (runtimeError?.code === 'ERRORED_DOCUMENT_REQUEST') {
            return [];
        }

        const { performance, accessibility } = categories || {};

        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] performance:  ${Object.keys(performance)?.join?.(',')}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] accessibility:  ${Object.keys(accessibility)?.join?.(',')}`,
        );

        const auditCategories = [performance, accessibility]
            .map(formatAuditCategory)
            .filter(Boolean);

        const auditMetrics = [
            audits?.['first-contentful-paint'],
            audits?.['largest-contentful-paint'],
            audits?.['cumulative-layout-shift'],
            audits?.['total-blocking-time'],
            audits?.['speed-index'],
        ]
            .map(formatAuditMetric)
            .filter(Boolean);

        if (!auditCategories?.length && !auditMetrics?.length) {
            return [];
        }

        const validCategories = auditCategories.filter((category) => category?.score !== null);
        const validMetrics = auditMetrics.filter((metric) => metric?.score !== null);

        if (!validCategories?.length && !validMetrics?.length) {
            return [];
        }

        return [...(validCategories || []), ...(validMetrics || [])];
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - parseLighthouseAuditReport] error:  ${error.message}`);
        return [];
    }
};

/**
 * Formats Lighthouse audit reports into a standardized structure.
 * @function formatLighthouseReports
 * @param {Object} options - An object containing the reports, application, and workspaceFolder.
 * @param {Array} options.reports - An array of Lighthouse audit reports.
 * @param {Object} options.application - The application object.
 * @param {string} options.workspaceFolder - The workspace folder path.
 * @returns {Array|null} - An array of formatted audit reports or null if no valid reports are found.
 */
const formatLighthouseReports = ({ reports, application, workspaceFolder }) => {
    try {
        if (!reports?.length) {
            return [];
        }

        const auditReports = [];

        for (const report of reports) {
            const { appLink: webUrl, data, subCategory } = report || {};

            const results = parseLighthouseAuditReport(data);

            if (!results?.length) {
                continue;
            }

            for (const result of results) {
                auditReports.push({
                    type: 'Lighthouse',
                    category: result.category,
                    subCategory,
                    status: result.status,
                    score: result.score,
                    scoreUnit: result.scoreUnit,
                    module: {
                        appId: application?._id,
                        url: webUrl,
                        branch: workspaceFolder.split('/').pop(),
                        path: webUrl,
                    },
                });
            }
        }

        AppLogger.info(
            `[LighthouseUtils - formatLighthouseReports] auditReports:  ${auditReports?.length}`,
        );

        return auditReports || [];
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - formatLighthouseReports] error:  ${error.message}`);
        return [];
    }
};

const LighthouseUtils = {
    isAuditFailed,
    formatAuditCategory,
    parseLighthouseAuditReport,
    formatLighthouseReports,
    formatAuditMetric,
    isAuditPerformanceFailed,
    isAuditAccessibilityFailed,
};

export default LighthouseUtils;

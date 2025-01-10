import { AppLogger, AuditType, Matcher, auditStatus } from '@v6y/core-logic';

import {
    LighthouseAuditCategoryType,
    LighthouseAuditMetricType,
    LighthouseAuditParamsType,
    LighthouseReportType,
} from '../types/LighthouseAuditType.ts';

/**
 * Check if the audit status is failed
 * @param status
 */
const isAuditFailed = (status?: string) =>
    status === auditStatus.warning || status === auditStatus.error;

/**
 * Check if the audit is performance and failed
 * @param report
 */
const isAuditPerformanceFailed = (report: AuditType) =>
    report.category === 'performance' && isAuditFailed(report.status);

/**
 * Check if the audit is accessibility and failed
 * @param report
 */
const isAuditAccessibilityFailed = (report: AuditType) =>
    report.category === 'accessibility' && isAuditFailed(report.status);

/**
 * Check if the audit is seo and failed
 * @param report
 */
const isAuditSeoFailed = (report: AuditType) =>
    report.category === 'seo' && isAuditFailed(report.status);

/**
 * Format the audit category
 * @param auditCategory
 */
const formatAuditCategory = (
    auditCategory?: LighthouseAuditCategoryType,
): LighthouseReportType | null => {
    if (!auditCategory) return null;

    const { id, title, score, description } = auditCategory;

    const currentScore = (score || 0) * 100;
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
        status: status as string,
        score: currentScore,
        scoreUnit: '%',
        branch: undefined,
    };
};

/**
 * Format the audit metric
 * @param auditMetric
 */
const formatAuditMetric = (
    auditMetric?: LighthouseAuditMetricType,
): LighthouseReportType | null => {
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
        status: indicatorStatus as string,
        description,
        score: parseFloat(indicatorScore.toFixed(2)),
        scoreUnit: indicatorScoreUnit,
        branch: undefined,
    };
};

/**
 * Parse the lighthouse audit report
 * @param auditReportData
 */
const parseLighthouseAuditReport = (
    auditReportData?: string | string[] | undefined,
): (LighthouseReportType | null)[] | null => {
    try {
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] data:  ${auditReportData?.length}`,
        );

        if (!auditReportData?.length) {
            return null;
        }

        const auditReports = Array.isArray(auditReportData) ? auditReportData[0] : auditReportData;
        const jsonData = JSON.parse(auditReports);
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] jsonData:  ${Object.keys(
                jsonData,
            )?.join?.(',')}`,
        );

        if (!jsonData || !Object.keys(jsonData)?.length) {
            return null;
        }

        const { categories, audits, runtimeError } = jsonData || {};

        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] runtimeError:  ${runtimeError?.code}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] categories:  ${Object.keys(
                categories,
            )?.join?.(',')}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] audits:  ${Object.keys(audits)?.join?.(
                ',',
            )}`,
        );

        if (runtimeError?.code === 'ERRORED_DOCUMENT_REQUEST') {
            return null;
        }

        const { performance, accessibility, seo } = categories || {};

        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] performance:  ${Object.keys(
                performance,
            )?.join?.(',')}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] accessibility:  ${Object.keys(
                accessibility,
            )?.join?.(',')}`,
        );
        AppLogger.info(
            `[LighthouseUtils - parseLighthouseAuditReport] seo:  ${Object.keys(seo)?.join?.(',')}`,
        );

        const auditCategories = [performance, accessibility, seo]
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
            return null;
        }

        const validCategories = auditCategories.filter((category) => category?.score !== null);
        const validMetrics = auditMetrics.filter((metric) => metric?.score !== null);

        if (!validCategories?.length && !validMetrics?.length) {
            return null;
        }

        return [...(validCategories || []), ...(validMetrics || [])]?.filter(Boolean);
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - parseLighthouseAuditReport] error:  ${error}`);
        return null;
    }
};

/**
 * Format the lighthouse reports
 * @param reports
 * @param application
 */
const formatLighthouseReports = ({
    reports,
    application,
}: LighthouseAuditParamsType): AuditType[] | null => {
    try {
        if (!reports?.length) {
            return [];
        }

        const auditReports: AuditType[] = [];

        for (const report of reports) {
            const { appLink: webUrl, data, subCategory } = report || {};

            const results = parseLighthouseAuditReport(data);

            if (!results?.length) {
                continue;
            }

            for (const result of results) {
                // eslint-disable-next-line max-depth
                if (!application?._id) {
                    continue;
                }

                auditReports.push({
                    type: 'Lighthouse',
                    category: result?.category,
                    subCategory,
                    status: result?.status,
                    score: result?.score,
                    scoreUnit: result?.scoreUnit,
                    module: {
                        appId: application?._id,
                        url: webUrl,
                        path: webUrl,
                        branch: undefined,
                    },
                });
            }
        }

        AppLogger.info(
            `[LighthouseUtils - formatLighthouseReports] auditReports:  ${auditReports?.length}`,
        );

        return auditReports;
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - formatLighthouseReports] error:  ${error}`);
        return null;
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
    isAuditSeoFailed,
};

export default LighthouseUtils;

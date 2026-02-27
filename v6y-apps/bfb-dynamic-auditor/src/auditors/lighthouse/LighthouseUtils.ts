import { AppLogger, AuditType, Matcher, auditStatus, scoreStatus } from '@v6y/core-logic';

import {
    LighthouseAuditCategoryType,
    LighthouseAuditMetricType,
    LighthouseAuditParamsType,
    LighthouseReportType,
} from '../types/LighthouseAuditType.ts';
import {
    computeEcoIndex,
    computeGhg,
    computeWater,
    getEcoIndexGrade,
} from './EcoindexComputeUtils.ts';

/**
 * Check if the audit status is failed
 * @param status
 */
const isAuditFailed = (status: string | null): boolean => {
    return status === auditStatus.failure || status === null || status === undefined;
};

/**
 * Check if the audit is performance and failed
 * @param report
 */
const isAuditPerformanceFailed = (report: AuditType) =>
    report.category === 'performance' && isAuditFailed(report.auditStatus);

/**
 * Check if the audit is accessibility and failed
 * @param report
 */
const isAuditAccessibilityFailed = (report: AuditType) =>
    report.category === 'accessibility' && isAuditFailed(report.auditStatus);

/**
 * Check if the audit is seo and failed
 * @param report
 */
const isAuditSeoFailed = (report: AuditType) =>
    report.category === 'seo' && isAuditFailed(report.auditStatus);

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
            () => scoreStatus.error,
        )
        .on(
            () => currentScore > 50 && currentScore < 70,
            () => scoreStatus.warning,
        )
        .on(
            () => currentScore > 70,
            () => scoreStatus.success,
        )
        .otherwise(() => auditStatus.info);

    return {
        category: id,
        title,
        description,
        auditStatus: auditStatus.success,
        scoreStatus: status as string,
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
                () => scoreStatus.success,
            )
            .on(
                () => indicatorScore >= 2.5 && indicatorScore < 4,
                () => scoreStatus.warning,
            )
            .on(
                () => indicatorScore >= 4,
                () => scoreStatus.error,
            )
            .otherwise(() => scoreStatus.info);
    }

    if (id === 'first-contentful-paint') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 1.8,
                () => scoreStatus.success,
            )
            .on(
                () => indicatorScore >= 1.8 && indicatorScore < 3,
                () => scoreStatus.warning,
            )
            .on(
                () => indicatorScore >= 3,
                () => scoreStatus.error,
            )
            .otherwise(() => scoreStatus.info);
    }

    if (id === 'total-blocking-time') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 0.2,
                () => scoreStatus.success,
            )
            .on(
                () => indicatorScore >= 0.2 && indicatorScore < 0.6,
                () => scoreStatus.warning,
            )
            .on(
                () => indicatorScore >= 0.6,
                () => scoreStatus.error,
            )
            .otherwise(() => scoreStatus.info);
    }

    if (id === 'speed-index') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 3.4,
                () => scoreStatus.success,
            )
            .on(
                () => indicatorScore >= 3.4 && indicatorScore < 5.8,
                () => scoreStatus.warning,
            )
            .on(
                () => indicatorScore >= 5.8,
                () => scoreStatus.error,
            )
            .otherwise(() => scoreStatus.info);
    }

    if (id === 'cumulative-layout-shift') {
        indicatorStatus = Matcher()
            .on(
                () => indicatorScore < 0.1,
                () => scoreStatus.success,
            )
            .on(
                () => indicatorScore >= 0.1 && indicatorScore < 0.25,
                () => scoreStatus.warning,
            )
            .on(
                () => indicatorScore >= 0.25,
                () => scoreStatus.error,
            )
            .otherwise(() => scoreStatus.info);
    }

    return {
        category: id,
        title: `${title || ''}`,
        auditStatus: auditStatus.success,
        scoreStatus: indicatorStatus as string,
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
): LighthouseReportType[] | null => {
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

        return [...(validCategories || []), ...(validMetrics || [])].filter(
            (item): item is LighthouseReportType => item !== null,
        );
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - parseLighthouseAuditReport] error:  ${error}`);
        return null;
    }
};

/**
 * Extract Ecoindex input metrics from raw Lighthouse JSON data.
 * Returns null if the required audits are not present.
 * @param auditReportData
 */
const extractEcoindexInputs = (
    auditReportData?: string | string[],
): { dom: number; requests: number; size: number } | null => {
    try {
        if (!auditReportData?.length) return null;
        const raw = Array.isArray(auditReportData) ? auditReportData[0] : auditReportData;
        const jsonData = JSON.parse(raw);
        const { audits } = jsonData || {};
        if (!audits) return null;

        const dom = audits?.['dom-size']?.numericValue;
        const requests = audits?.['network-requests']?.numericValue;
        const sizeBytes = audits?.['total-byte-weight']?.numericValue;

        if (dom == null || requests == null || sizeBytes == null) return null;

        return {
            dom: Math.round(dom),
            requests: Math.round(requests),
            size: Math.round(sizeBytes / 1024), // convert bytes to Kb
        };
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - extractEcoindexInputs] error: ${error}`);
        return null;
    }
};

/**
 * Compute a single Ecoindex AuditType entry from Lighthouse raw data.
 * Uses the GreenIT-Analysis reference algorithm (no external package).
 * @param data
 * @param subCategory - device (mobile/desktop)
 * @param appId
 * @param webUrl
 */
const computeEcoindexAuditEntry = ({
    data,
    subCategory,
    appId,
    webUrl,
}: {
    data?: string | string[];
    subCategory?: string;
    appId?: number;
    webUrl?: string;
}): AuditType | null => {
    try {
        const inputs = extractEcoindexInputs(data);
        if (!inputs) return null;

        const { dom, requests, size } = inputs;
        const score = computeEcoIndex(dom, requests, size);
        const grade = getEcoIndexGrade(score);
        const water = computeWater(score);
        const ghg = computeGhg(score);

        const ecoScoreStatus = Matcher()
            .on(
                () => grade <= 'B',
                () => scoreStatus.success,
            )
            .on(
                () => grade <= 'D',
                () => scoreStatus.warning,
            )
            .otherwise(() => scoreStatus.error);

        return {
            type: 'Ecoindex',
            category: 'ecoindex',
            subCategory,
            auditStatus: auditStatus.success,
            scoreStatus: ecoScoreStatus as string,
            score: parseFloat(score.toFixed(1)),
            scoreUnit: '/100',
            extraInfos: JSON.stringify({ grade, water, ghg, dom, requests, size }),
            module: {
                appId: appId as number,
                url: webUrl,
                path: webUrl,
                branch: undefined,
            },
        };
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - computeEcoindexAuditEntry] error: ${error}`);
        return null;
    }
};

const buildLighthouseAuditEntries = ({
    results,
    appId,
    webUrl,
    subCategory,
}: {
    results: ReturnType<typeof parseLighthouseAuditReport>;
    appId: number;
    webUrl: string | undefined;
    subCategory: string | undefined;
}): AuditType[] => {
    if (!results?.length) return [];
    return results.map((result) => ({
        type: 'Lighthouse',
        category: result?.category,
        subCategory,
        auditStatus: result.auditStatus || auditStatus.failure,
        scoreStatus: result.scoreStatus || null,
        score: result.score || null,
        scoreUnit: result?.scoreUnit,
        module: {
            appId,
            url: webUrl,
            path: webUrl,
            branch: undefined,
        },
    }));
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

            if (!application?._id) {
                continue;
            }

            const results = parseLighthouseAuditReport(data);
            auditReports.push(
                ...buildLighthouseAuditEntries({
                    results,
                    appId: application._id,
                    webUrl,
                    subCategory,
                }),
            );

            // Compute Ecoindex from the same raw Lighthouse data
            const ecoindexEntry = computeEcoindexAuditEntry({
                data,
                subCategory,
                appId: application._id,
                webUrl,
            });
            if (ecoindexEntry) {
                auditReports.push(ecoindexEntry);
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

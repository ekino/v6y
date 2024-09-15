import { AppLogger, Matcher } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';

const isAuditFailed = (status) => status === 'warning' || status === 'error';

const isAuditPerformanceFailed = (report) =>
    report.category === 'performance' && isAuditFailed(report.status);

const isAuditAccessibilityFailed = (report) =>
    report.category === 'accessibility' && isAuditFailed(report.status);

const formatAuditCategory = (auditCategory) => {
    if (!auditCategory) return null;

    const { id, title, score, description } = auditCategory;

    const currentScore = score * 100;
    const status = Matcher()
        .on(
            () => currentScore < 50,
            () => 'error',
        )
        .on(
            () => currentScore > 50 && currentScore < 70,
            () => 'warning',
        )
        .on(
            () => currentScore > 70,
            () => 'success',
        )
        .otherwise(() => 'normal');

    return {
        category: id,
        title,
        description,
        status,
        score: currentScore,
        scoreUnit: '%',
        scoreMin: 0,
        scoreMax: 100,
        branch: null,
    };
};

const formatAuditMetric = (auditMetric) => {
    if (!auditMetric) return null;

    const { id, title, description, numericValue, numericUnit } = auditMetric;

    const indicatorScore =
        (numericUnit !== 'unitless' ? (numericValue || 0) / 1000 : numericValue) || 0;

    const indicatorScoreUnit = numericUnit !== 'unitless' ? 's' : '';

    let indicatorColor = null;

    if (id === 'largest-contentful-paint') {
        indicatorColor = Matcher()
            .on(
                () => indicatorScore < 2.5,
                () => 'success',
            )
            .on(
                () => indicatorScore >= 2.5 && indicatorScore < 4,
                () => 'warning',
            )
            .on(
                () => indicatorScore >= 4,
                () => 'error',
            )
            .otherwise(() => 'info');
    }

    if (id === 'first-contentful-paint') {
        indicatorColor = Matcher()
            .on(
                () => indicatorScore < 1.8,
                () => 'success',
            )
            .on(
                () => indicatorScore >= 1.8 && indicatorScore < 3,
                () => 'warning',
            )
            .on(
                () => indicatorScore >= 3,
                () => 'error',
            )
            .otherwise(() => 'info');
    }

    if (id === 'total-blocking-time') {
        indicatorColor = Matcher()
            .on(
                () => indicatorScore < 0.2,
                () => 'success',
            )
            .on(
                () => indicatorScore >= 0.2 && indicatorScore < 0.6,
                () => 'warning',
            )
            .on(
                () => indicatorScore >= 0.6,
                () => 'error',
            )
            .otherwise(() => 'info');
    }

    if (id === 'speed-index') {
        indicatorColor = Matcher()
            .on(
                () => indicatorScore < 3.4,
                () => 'success',
            )
            .on(
                () => indicatorScore >= 3.4 && indicatorScore < 5.8,
                () => 'warning',
            )
            .on(
                () => indicatorScore >= 5.8,
                () => 'error',
            )
            .otherwise(() => 'info');
    }

    if (id === 'cumulative-layout-shift') {
        indicatorColor = Matcher()
            .on(
                () => indicatorScore < 0.1,
                () => 'success',
            )
            .on(
                () => indicatorScore >= 0.1 && indicatorScore < 0.25,
                () => 'warning',
            )
            .on(
                () => indicatorScore >= 0.25,
                () => 'error',
            )
            .otherwise(() => 'info');
    }

    return {
        category: id,
        title: `${title || ''}`,
        status: indicatorColor,
        description,
        score: indicatorScore.toFixed(2),
        // scorePercent: (indicatorScore / indicatorMaxValue) * 100,
        scoreUnit: indicatorScoreUnit,
        branch: null,
    };
};

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

        const auditCategories = [performance, accessibility].map(formatAuditCategory);

        const auditMetrics = [
            audits?.['first-contentful-paint'],
            audits?.['largest-contentful-paint'],
            audits?.['cumulative-layout-shift'],
            audits?.['total-blocking-time'],
            audits?.['speed-index'],
        ].map(formatAuditMetric);

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

const formatLighthouseReports = ({ reports, application, workspaceFolder }) => {
    try {
        if (!reports?.length) {
            return null;
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
                    status: auditStatus.error,
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

        return auditReports;
    } catch (error) {
        AppLogger.info(`[LighthouseUtils - formatLighthouseReports] error:  ${error.message}`);
        return null;
    }
};

const LighthouseUtils = {
    formatLighthouseReports,
    isAuditPerformanceFailed,
    isAuditAccessibilityFailed,
};

export default LighthouseUtils;

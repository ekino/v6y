import { AuditType, Matcher, auditStatus, scoreStatus } from '@v6y/core-logic';

import { ApplicationCodeComplexityReportType } from '../types/CodeComplexityAuditType.ts';

/**
 * Format maintainability status
 * @param fileMaintainability
 */
const formatMaintainabilityStatus = (fileMaintainability: number) =>
    Matcher()
        .on(
            () => Math.round(fileMaintainability || 0) < 65,
            () => scoreStatus.error,
        )
        .on(
            () => Math.round(fileMaintainability || 0) >= 85,
            () => scoreStatus.success,
        )
        .on(
            () =>
                Math.round(fileMaintainability || 0) >= 65 &&
                Math.round(fileMaintainability || 0) < 85,
            () => scoreStatus.warning,
        )
        .otherwise(() => scoreStatus.info);

/**
 * Format halstead reports
 * @param halsteadMetrics
 * @param application
 * @param analyzedFile
 * @param analyzedBranch
 */
const formatHalsteadReports = ({
    halsteadMetrics,
    application,
    analyzedFile,
    analyzedBranch,
}: ApplicationCodeComplexityReportType): AuditType[] => {
    const { bugs, difficulty, effort, length, time, volume } = halsteadMetrics || {};

    const halsteadReports: AuditType[] = [];

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    if (length) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-length',
            subCategory: undefined,
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: length,
            scoreUnit: '',
            module,
        });
    }

    if (volume) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-volume',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: volume,
            scoreUnit: 'bit',
            module,
        });
    }

    if (difficulty) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-difficulty',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: difficulty,
            scoreUnit: '',
            module,
        });
    }

    if (effort) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-effort',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: effort,
            scoreUnit: 'bit',
            module,
        });
    }

    if (bugs) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-estimated-bugs',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: bugs,
            scoreUnit: '',
            module,
        });
    }

    if (time) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-time-to-implement',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: time,
            scoreUnit: 's',
            module,
        });
    }

    return halsteadReports;
};

/**
 * Format cyclomatic complexity report
 * @param cyclomaticMetric
 * @param application
 * @param analyzedFile
 * @param analyzedBranch
 */
const formatCyclomaticComplexityReport = ({
    cyclomaticMetric,
    application,
    analyzedFile,
    analyzedBranch,
}: ApplicationCodeComplexityReportType): AuditType => {
    const complexityStatus = Matcher()
        .on(
            () => cyclomaticMetric <= 10,
            () => scoreStatus.success,
        )
        .on(
            () => cyclomaticMetric > 10 && cyclomaticMetric <= 20,
            () => scoreStatus.warning,
        )
        .on(
            () => cyclomaticMetric > 20 && cyclomaticMetric <= 40,
            () => scoreStatus.error,
        )
        .on(
            () => cyclomaticMetric > 40,
            () => scoreStatus.error,
        )
        .otherwise(() => '');

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    return {
        type: 'Code-Complexity',
        category: 'cyclomatic-complexity',
        auditStatus: auditStatus.success,
        scoreStatus: complexityStatus as string,
        score: cyclomaticMetric,
        scoreUnit: '',
        module,
    };
};

/**
 * Format maintainability index report
 * @param fileMaintainability
 * @param application
 * @param analyzedFile
 * @param analyzedBranch
 */
const formatMaintainabilityIndexReport = ({
    fileMaintainability,
    application,
    analyzedFile,
    analyzedBranch,
}: ApplicationCodeComplexityReportType): AuditType => {
    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    return {
        type: 'Code-Complexity',
        category: 'maintainability-index',
        auditStatus: auditStatus.success,
        scoreStatus: formatMaintainabilityStatus(fileMaintainability) as string,
        score: fileMaintainability,
        scoreUnit: '%',
        module,
    };
};

/**
 * Format file SLOC indicators
 * @param fileSLOC
 * @param application
 * @param analyzedFile
 * @param analyzedBranch
 */
const formatFileSLOCIndicators = ({
    fileSLOC,
    application,
    analyzedFile,
    analyzedBranch,
}: ApplicationCodeComplexityReportType): AuditType[] => {
    const codeSLOCIndicators: AuditType[] = [];

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    if (fileSLOC) {
        codeSLOCIndicators.push({
            type: 'Code-Complexity',
            category: 'physical-sloc',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: fileSLOC.physical || 0,
            scoreUnit: '',
            module,
        });

        codeSLOCIndicators.push({
            type: 'Code-Complexity',
            category: 'logical-sloc',
            auditStatus: auditStatus.success,
            scoreStatus: scoreStatus.info,
            score: fileSLOC.logical || 0,
            scoreUnit: '',
            module,
        });
    }

    return codeSLOCIndicators;
};

/**
 * Format code complexity summary
 * @param summary
 * @param application
 * @param analyzedFile
 * @param analyzedBranch
 */
const formatCodeComplexitySummary = ({
    summary,
    application,
    analyzedFile,
    analyzedBranch,
}: ApplicationCodeComplexityReportType): AuditType => {
    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    if (!summary) {
        return {
            type: 'Code-Complexity',
            category: 'maintainability-index-project-average',
            auditStatus: auditStatus.failure,
            scoreStatus: null,
            score: null,
            scoreUnit: '%',
            module,
        };
    }

    return {
        type: 'Code-Complexity',
        category: 'maintainability-index-project-average',
        auditStatus: auditStatus.success,
        scoreStatus: formatMaintainabilityStatus(summary?.average?.maintainability) as string,
        score: summary?.average?.maintainability,
        scoreUnit: '%',
        module,
    };
};

const CodeComplexityConfig = {
    formatHalsteadReports,
    formatMaintainabilityStatus,
    formatMaintainabilityIndexReport,
    formatCyclomaticComplexityReport,
    formatFileSLOCIndicators,
    formatCodeComplexitySummary,
};

export default CodeComplexityConfig;

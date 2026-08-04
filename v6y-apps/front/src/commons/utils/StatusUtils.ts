const successColor = 'text-green-600 bg-green-50 border-green-200';
const warningColor = 'text-yellow-600 bg-yellow-50 border-yellow-200';
const errorColor = 'text-red-600 bg-red-50 border-red-200';
const infoColor = 'text-blue-600 bg-blue-50 border-blue-200';

const scoreStatusColors: Record<string, string> = {
    success: successColor,
    good: successColor,
    warning: warningColor,
    error: errorColor,
    failure: errorColor,
    failed: errorColor,
    fail: errorColor,
    info: infoColor,
};

const getScoreStatusColor = (scoreStatus: string): string => {
    return scoreStatusColors[scoreStatus] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const indicatorColors: Record<string, { bgColor: string; textColor: string }> = {
    A: { bgColor: 'bg-green-400', textColor: 'text-green-100' },
    B: { bgColor: 'bg-orange-400', textColor: 'text-orange-100' },
    C: { bgColor: 'bg-red-500', textColor: 'text-red-100' },
};

const getIndicatorColors = (grade: string) => {
    return indicatorColors[grade] || { bgColor: 'bg-gray-400', textColor: 'text-gray-100' };
};

const statusLabels: Record<string, string> = {
    error: 'Critical',
    warning: 'Warning',
    success: 'Up to date',
    info: 'Info',
};

const getStatusLabel = (status: string | undefined) => {
    return status ? statusLabels[status] || 'Unknown' : 'Unknown';
};

type NormalizedDependencyStatus = 'success' | 'warning' | 'error' | 'unknown';

// Single source of truth for classifying a raw dependency status string.
// Keep in sync with `isDependencyUpToDate` in VitalityDependencyUtils.ts.
const classifyDependencyStatus = (status?: string | null): NormalizedDependencyStatus => {
    const statusLower = status?.toLowerCase() || '';

    if (
        statusLower.includes('up to date') ||
        statusLower.includes('up-to-date') ||
        statusLower.includes('success')
    ) {
        return 'success';
    }

    if (statusLower.includes('warning') || statusLower.includes('minor')) {
        return 'warning';
    }

    if (
        statusLower.includes('error') ||
        statusLower.includes('major') ||
        statusLower.includes('critical')
    ) {
        return 'error';
    }

    return 'unknown';
};

const dependencyStatusColorByKey: Record<NormalizedDependencyStatus, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    unknown: 'bg-slate-100 text-slate-800',
};

const getDependencyStatusColor = (status: string): string => {
    return dependencyStatusColorByKey[classifyDependencyStatus(status)];
};

type NormalizedReportStatus = 'success' | 'warning' | 'error' | 'info' | 'unknown';

// Single source of truth for classifying an audit report status. Used by
// VitalityAuditReportsSection and VitalityAuditReportsSummary so both agree
// on the same buckets, including `info` (the most-emitted status across the
// bfb-* auditors).
const normalizeReportStatus = (status?: string | null): NormalizedReportStatus => {
    const normalized = status?.toLowerCase() || '';

    if (normalized === 'success' || normalized === 'good') {
        return 'success';
    }

    if (normalized === 'warning') {
        return 'warning';
    }

    if (['error', 'failure', 'failed', 'fail'].includes(normalized)) {
        return 'error';
    }

    if (normalized === 'info') {
        return 'info';
    }

    return 'unknown';
};

export {
    classifyDependencyStatus,
    getDependencyStatusColor,
    getIndicatorColors,
    getScoreStatusColor,
    getStatusLabel,
    normalizeReportStatus,
};
export type { NormalizedDependencyStatus, NormalizedReportStatus };

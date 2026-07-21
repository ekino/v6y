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

const dependencyStatusColors: Array<{ match: (statusLower: string) => boolean; color: string }> = [
    {
        match: (statusLower) =>
            statusLower.includes('up to date') || statusLower.includes('success'),
        color: 'bg-green-100 text-green-800',
    },
    {
        match: (statusLower) => statusLower.includes('warning') || statusLower.includes('minor'),
        color: 'bg-yellow-100 text-yellow-800',
    },
    {
        match: (statusLower) =>
            statusLower.includes('error') ||
            statusLower.includes('major') ||
            statusLower.includes('critical'),
        color: 'bg-red-100 text-red-800',
    },
];

const getDependencyStatusColor = (status: string): string => {
    const statusLower = status?.toLowerCase() || '';
    return (
        dependencyStatusColors.find(({ match }) => match(statusLower))?.color ||
        'bg-slate-100 text-slate-800'
    );
};

export { getDependencyStatusColor, getIndicatorColors, getScoreStatusColor, getStatusLabel };

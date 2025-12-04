const scoreStatusColors: Record<string, string> = {
    success: 'text-green-600 bg-green-50 border-green-200',
    good: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200',
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

export { getScoreStatusColor, getIndicatorColors, getStatusLabel };

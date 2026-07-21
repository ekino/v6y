import React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';

interface AuditRunType {
    _id: number;
    runStatus: string;
    analysisTypes: string[];
    triggeredAt: string;
    completedAt: string | null;
    errorMessage: string | null;
    audits?: Array<{ _id: number; type: string; category: string }>;
}

interface VitalityAuditRunHistoryProps {
    auditRuns: AuditRunType[];
    isLoading?: boolean;
    onRunClick?: (runId: number) => void;
    pageSize?: number;
}

const Badge = ({
    children,
    variant = 'info',
    className = '',
}: {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info';
    className?: string;
}) => {
    const variantClasses = {
        success: 'bg-green-100 text-green-800 border border-green-200',
        warning: 'bg-amber-100 text-amber-800 border border-amber-200',
        error: 'bg-red-100 text-red-800 border border-red-200',
        info: 'bg-blue-100 text-blue-800 border border-blue-200',
    };

    return (
        <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-50 border-green-200';
        case 'in_progress':
            return 'bg-blue-50 border-blue-200';
        case 'pending':
            return 'bg-amber-50 border-amber-200';
        case 'error':
        case 'failed':
            return 'bg-red-50 border-red-200';
        default:
            return 'bg-slate-50 border-slate-200';
    }
};

const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'in_progress':
            return 'info';
        case 'pending':
            return 'warning';
        case 'error':
        case 'failed':
            return 'error';
        default:
            return 'info';
    }
};

const parseDateValue = (value: string | null | undefined) => {
    if (!value) return null;

    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    const isNumericTimestamp = /^\d+$/.test(trimmedValue);
    const date = isNumericTimestamp
        ? new Date(
              Number(trimmedValue) < 1_000_000_000_000
                  ? Number(trimmedValue) * 1000
                  : Number(trimmedValue),
          )
        : new Date(trimmedValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
};

export const formatDate = (dateString: string | null | undefined) => {
    const date = parseDateValue(dateString);
    if (!date) return '-';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getDuration = (
    startDate: string | null | undefined,
    endDate: string | null | undefined,
) => {
    const start = parseDateValue(startDate);
    const end = parseDateValue(endDate);
    if (!start || !end) return null;

    const durationMs = end.getTime() - start.getTime();
    if (durationMs < 0) return null;

    const seconds = Math.floor(durationMs / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};

export const VitalityAuditRunHistory: React.FC<VitalityAuditRunHistoryProps> = ({
    auditRuns = [],
    isLoading = false,
    onRunClick,
    pageSize = 8,
}) => {
    const { translate } = useTranslationProvider();

    const sortedRuns = React.useMemo(
        () =>
            [...(auditRuns || [])].sort((runA, runB) => {
                const runADate = parseDateValue(runA.triggeredAt)?.getTime() || 0;
                const runBDate = parseDateValue(runB.triggeredAt)?.getTime() || 0;
                return runBDate - runADate;
            }),
        [auditRuns],
    );

    const [currentPage, setCurrentPage] = React.useState(1);
    const totalPages = Math.max(1, Math.ceil(sortedRuns.length / pageSize));

    React.useEffect(() => {
        setCurrentPage(1);
    }, [sortedRuns.length, pageSize]);

    const currentRuns = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedRuns.slice(startIndex, startIndex + pageSize);
    }, [sortedRuns, currentPage, pageSize]);

    if (isLoading) {
        return (
            <div className="w-full p-6 text-center text-slate-500">
                {translate('vitality.appDetailsPage.loadingStates.auditReports')}
            </div>
        );
    }

    if (!sortedRuns || sortedRuns.length === 0) {
        return (
            <div className="w-full p-6 text-center">
                <p className="text-slate-500">
                    {translate('vitality.appDetailsPage.auditHistory.emptyMessage')}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="block sm:hidden">
                <div className="divide-y divide-slate-200">
                    {currentRuns.map((run, index) => {
                        const duration = getDuration(run.triggeredAt, run.completedAt);

                        return (
                            <div
                                key={run._id || index}
                                onClick={onRunClick ? () => onRunClick(run._id) : undefined}
                                className={`border-b border-slate-200 p-5 transition-colors ${onRunClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50'} ${getStatusColor(run.runStatus)}`}
                            >
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <Badge variant={getStatusBadgeVariant(run.runStatus)}>
                                        {translate(
                                            `vitality.appDetailsPage.auditHistory.statuses.${run.runStatus}`,
                                        ) || run.runStatus}
                                    </Badge>
                                    <span className="whitespace-nowrap text-xs text-slate-500">
                                        {formatDate(run.triggeredAt)}
                                    </span>
                                </div>

                                {run.analysisTypes && run.analysisTypes.length > 0 && (
                                    <div className="mb-3">
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                            {translate(
                                                'vitality.appDetailsPage.auditHistory.mobile.types',
                                            )}
                                            :
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {run.analysisTypes.map((type, idx) => (
                                                <Badge key={idx} variant="info" className="text-xs">
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {duration && (
                                    <p className="mb-2 text-xs text-slate-600">
                                        <span className="font-semibold text-slate-700">
                                            {translate(
                                                'vitality.appDetailsPage.auditHistory.mobile.duration',
                                            )}
                                        </span>
                                        : {duration}
                                    </p>
                                )}

                                {run.audits && run.audits.length > 0 && (
                                    <p className="mb-2 text-xs text-slate-600">
                                        <span className="font-semibold text-slate-700">
                                            {translate(
                                                'vitality.appDetailsPage.auditHistory.mobile.audits',
                                            )}
                                        </span>
                                        : {run.audits.length}
                                    </p>
                                )}

                                {run.errorMessage && (
                                    <div className="mt-3 rounded border border-red-200 bg-red-50 p-3">
                                        <p className="mb-1 text-xs font-semibold text-red-800">
                                            {translate(
                                                'vitality.appDetailsPage.auditHistory.mobile.error',
                                            )}
                                            :
                                        </p>
                                        <p className="text-xs text-red-700">{run.errorMessage}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 border-b-2 border-slate-200 bg-slate-50">
                        <tr>
                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                                {translate('vitality.appDetailsPage.auditHistory.table.columns.status')}
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                                {translate(
                                    'vitality.appDetailsPage.auditHistory.table.columns.analysisTypes',
                                )}
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                                {translate('vitality.appDetailsPage.auditHistory.table.columns.triggered')}
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                                {translate('vitality.appDetailsPage.auditHistory.table.columns.duration')}
                            </th>
                            <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                                {translate('vitality.appDetailsPage.auditHistory.table.columns.audits')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {currentRuns.map((run, index) => {
                            const duration = getDuration(run.triggeredAt, run.completedAt);

                            return (
                                <tr
                                    key={run._id || index}
                                    className={`transition-colors duration-150 ${onRunClick ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-blue-50'}`}
                                    onClick={onRunClick ? () => onRunClick(run._id) : undefined}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-2">
                                            <Badge variant={getStatusBadgeVariant(run.runStatus)}>
                                                {translate(
                                                    `vitality.appDetailsPage.auditHistory.statuses.${run.runStatus}`,
                                                ) || run.runStatus}
                                            </Badge>
                                            {run.errorMessage && (
                                                <p className="max-w-xs truncate text-xs text-red-700">
                                                    {run.errorMessage}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            {run.analysisTypes?.map((type, idx) => (
                                                <Badge key={idx} variant="info" className="text-xs">
                                                    {type}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                        {formatDate(run.triggeredAt)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600">
                                        {duration || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold text-slate-600">
                                        {run.audits?.length || 0}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-xs text-slate-600">
                        Page {currentPage} / {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VitalityAuditRunHistory;

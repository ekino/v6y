import * as React from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

import { AuditType } from '@v6y/core-logic/src/types';
import {
    AlertTriangle,
    Badge,
    Card,
    CardContent,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    Check,
} from '@v6y/ui-kit-front';

import VitalityAuditReportsSummary from './VitalityAuditReportsSummary';

interface VitalityAuditReportsSectionLabels {
    overviewTitle: string;
    healthyLabel: string;
    warningLabel: string;
    errorLabel: string;
    attentionNeededLabel: string;
    statusByFamilyTitle: string;
    statusByFamilyDescription: string;
    statusBreakdownTitle: string;
    statusBreakdownDescription: string;
    priorityFindingsTitle: string;
    priorityFindingsDescription: string;
    noIssuesMessage: string;
    impactedChecksLabel: string;
}

type ChartVariant = 'family' | 'breakdown';

interface VitalityAuditReportsSectionProps {
    title: string;
    reports: AuditType[];
    description: string;
    labels?: Partial<VitalityAuditReportsSectionLabels>;
    chartVariant?: ChartVariant;
}

const defaultLabels: VitalityAuditReportsSectionLabels = {
    overviewTitle: 'Report health overview',
    healthyLabel: 'Healthy',
    warningLabel: 'Warning',
    errorLabel: 'Critical',
    attentionNeededLabel: 'Attention needed',
    statusByFamilyTitle: 'Status by metric family',
    statusByFamilyDescription: 'Radar chart highlights where health checks are drifting.',
    statusBreakdownTitle: 'Status breakdown',
    statusBreakdownDescription: 'Share of checks that are healthy, in warning, or critical.',
    priorityFindingsTitle: 'Priority findings',
    priorityFindingsDescription: 'Focus these checks first to reduce project risk quickly.',
    noIssuesMessage: 'No warning or critical findings were detected in this report.',
    impactedChecksLabel: 'Impacted checks',
};

const statusOrder = {
    error: 0,
    warning: 1,
    success: 2,
    unknown: 3,
} as const;

const getStatusKey = (status?: string | null) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === 'failure' || normalizedStatus === 'error') {
        return 'error';
    }

    if (normalizedStatus === 'warning') {
        return 'warning';
    }

    if (normalizedStatus === 'success') {
        return 'success';
    }

    return 'unknown';
};

const getStatusBadgeClassName = (statusKey: keyof typeof statusOrder) => {
    switch (statusKey) {
        case 'success':
            return 'border-emerald-200 bg-emerald-50 text-emerald-800';
        case 'warning':
            return 'border-amber-200 bg-amber-50 text-amber-800';
        case 'error':
            return 'border-red-200 bg-red-50 text-red-800';
        default:
            return 'border-slate-200 bg-slate-100 text-slate-700';
    }
};

const getCategoryGroup = (category: string): string => {
    const cat = category?.toLowerCase() || '';

    if (cat.startsWith('halstead-')) return 'Halstead metrics';
    if (cat.includes('maintainability') || cat.includes('complexity'))
        return 'Complexity & maintainability';
    if (cat.includes('coupling') || cat.includes('modularity')) return 'Coupling & modularity';
    if (cat.includes('duplication')) return 'Code duplication';
    if (cat.includes('instability')) return 'Instability metrics';
    if (
        cat.includes('performance') ||
        cat.includes('speed') ||
        cat.includes('blocking') ||
        cat.includes('largest-contentful') ||
        cat.includes('cumulative-layout')
    )
        return 'Performance metrics';
    if (cat.includes('seo') || cat.includes('search')) return 'SEO & search';
    if (
        cat.includes('dora') ||
        cat === 'devops' ||
        category === 'DEPLOYMENT_FREQUENCY' ||
        category === 'LEAD_REVIEW_TIME' ||
        category === 'LEAD_TIME_FOR_CHANGES' ||
        category === 'CHANGE_FAILURE_RATE' ||
        category === 'MEAN_TIME_TO_RESTORE_SERVICE' ||
        category === 'UP_TIME_AVERAGE'
    )
        return 'DevOps (DORA)';
    if (cat.includes('bundle') || cat.includes('size')) return 'Bundle analysis';
    if (cat.startsWith('commons-') || cat.startsWith('react-') || cat.startsWith('angular-'))
        return 'Security smells';

    return category || 'Uncategorized';
};

const VitalityAuditReportsSection = ({
    title,
    reports,
    description,
    labels = {},
    chartVariant = 'family',
}: VitalityAuditReportsSectionProps) => {
    const copyLabels = { ...defaultLabels, ...labels };

    const groupedReports = React.useMemo(
        () =>
            reports.reduce(
                (acc, report) => {
                    const group = getCategoryGroup(report.category || '');
                    if (!acc[group]) {
                        acc[group] = [];
                    }
                    acc[group].push(report);
                    return acc;
                },
                {} as Record<string, AuditType[]>,
            ),
        [reports],
    );

    const chartData = React.useMemo(
        () =>
            Object.entries(groupedReports)
                .map(([group, groupReports]) => {
                    const counts = groupReports.reduce(
                        (acc, report) => {
                            const statusKey = getStatusKey(
                                report.scoreStatus || report.auditStatus,
                            );
                            acc[statusKey] += 1;
                            return acc;
                        },
                        {
                            success: 0,
                            warning: 0,
                            error: 0,
                            unknown: 0,
                        },
                    );

                    return {
                        metricGroup: group,
                        ...counts,
                    };
                })
                .sort((left, right) => {
                    const leftRisk = left.error + left.warning;
                    const rightRisk = right.error + right.warning;
                    return rightRisk - leftRisk || right.error - left.error;
                }),
        [groupedReports],
    );

    const summary = React.useMemo(
        () =>
            reports.reduce(
                (acc, report) => {
                    const statusKey = getStatusKey(report.scoreStatus || report.auditStatus);
                    acc[statusKey] += 1;
                    return acc;
                },
                {
                    success: 0,
                    warning: 0,
                    error: 0,
                    unknown: 0,
                },
            ),
        [reports],
    );

    const priorityFindings = React.useMemo(() => {
        const groupedFindings = reports.reduce(
            (acc, report) => {
                const statusKey = getStatusKey(report.scoreStatus || report.auditStatus);
                if (statusKey !== 'warning' && statusKey !== 'error') {
                    return acc;
                }

                const label = report.category || report.type || 'Uncategorized';
                const groupKey = `${statusKey}::${label}`;

                if (!acc[groupKey]) {
                    acc[groupKey] = {
                        statusKey,
                        label,
                        impactedChecks: 0,
                    };
                }

                acc[groupKey].impactedChecks += 1;
                return acc;
            },
            {} as Record<
                string,
                { statusKey: keyof typeof statusOrder; label: string; impactedChecks: number }
            >,
        );

        return Object.values(groupedFindings)
            .sort((left, right) => {
                if (left.statusKey !== right.statusKey) {
                    return statusOrder[left.statusKey] - statusOrder[right.statusKey];
                }

                return right.impactedChecks - left.impactedChecks;
            })
            .slice(0, 8);
    }, [reports]);

    if (!reports?.length) {
        return (
            <div className="mb-8">
                <div className="mb-6 space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                    <p className="max-w-[70ch] text-sm text-slate-600">{description}</p>
                </div>
                <Card className="border-slate-200 shadow-xs">
                    <CardContent className="flex items-center justify-center p-10">
                        <p className="text-sm text-slate-500">
                            No reports available in this category.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const hasIssues = summary.error + summary.warning > 0;

    const chartConfig = {
        error: {
            label: copyLabels.errorLabel,
            color: '#1f1f1f',
        },
        warning: {
            label: copyLabels.warningLabel,
            color: '#666666',
        },
        success: {
            label: copyLabels.healthyLabel,
            color: '#8f8f8f',
        },
    } satisfies ChartConfig;

    const radarData = (
        [
            { key: 'error', value: summary.error },
            { key: 'warning', value: summary.warning },
            { key: 'success', value: summary.success },
        ] as const
    ).filter((entry) => entry.value > 0);

    // A radar chart needs at least 3 axes to draw a legible polygon; with 1-2
    // metric families it degenerates to a single spoke or a flat line, so we
    // fall back to a readable stacked-bar list instead.
    const hasEnoughFamiliesForRadar = chartData.length >= 3;

    // Same constraint applies to the breakdown radar: with only 1-2 of the
    // error/warning/success statuses actually present, it can't form a
    // legible polygon either, so fall back to a single overall status bar.
    const hasEnoughStatusesForRadar = radarData.length >= 3;
    const breakdownTotal = summary.error + summary.warning + summary.success;

    return (
        <div className="mb-8 space-y-5">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="max-w-[70ch] text-sm text-slate-600">{description}</p>
            </div>

            <VitalityAuditReportsSummary reports={reports} />

            <Card className="border-slate-200 shadow-xs">
                <CardContent className="space-y-2 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900">
                            {copyLabels.overviewTitle}
                        </h4>
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                hasIssues ? 'text-red-700' : 'text-slate-600'
                            }`}
                        >
                            {hasIssues ? (
                                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {hasIssues
                                ? copyLabels.attentionNeededLabel
                                : copyLabels.noIssuesMessage}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600">
                        {copyLabels.errorLabel}: {summary.error} · {copyLabels.warningLabel}:{' '}
                        {summary.warning} · {copyLabels.healthyLabel}: {summary.success}
                    </p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
                <CardContent className="space-y-4 p-5">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                            {chartVariant === 'breakdown'
                                ? copyLabels.statusBreakdownTitle
                                : copyLabels.statusByFamilyTitle}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600">
                            {chartVariant === 'breakdown'
                                ? copyLabels.statusBreakdownDescription
                                : copyLabels.statusByFamilyDescription}
                        </p>
                    </div>

                    {chartVariant === 'breakdown' ? (
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                {(['error', 'warning', 'success'] as const).map((key) => (
                                    <span
                                        key={key}
                                        className="flex items-center gap-1.5 text-xs text-slate-600"
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: chartConfig[key].color }}
                                            aria-hidden="true"
                                        />
                                        {chartConfig[key].label}
                                    </span>
                                ))}
                            </div>

                            {hasEnoughStatusesForRadar ? (
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-70"
                                >
                                    <RadarChart
                                        data={radarData}
                                        margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
                                    >
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent hideLabel nameKey="key" />
                                            }
                                        />
                                        <PolarGrid />
                                        <PolarAngleAxis
                                            dataKey="key"
                                            tickFormatter={(key: string) =>
                                                chartConfig[key as keyof typeof chartConfig]
                                                    ?.label ?? key
                                            }
                                        />
                                        <PolarRadiusAxis tick={false} axisLine={false} />
                                        <Radar
                                            dataKey="value"
                                            fill="#0f172a"
                                            fillOpacity={0.28}
                                            stroke="#0f172a"
                                            strokeWidth={2}
                                            dot={{ r: 3, fillOpacity: 1 }}
                                        />
                                    </RadarChart>
                                </ChartContainer>
                            ) : breakdownTotal > 0 ? (
                                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    {summary.error > 0 && (
                                        <div
                                            className="h-full"
                                            style={{
                                                width: `${(summary.error / breakdownTotal) * 100}%`,
                                                backgroundColor: chartConfig.error.color,
                                            }}
                                        />
                                    )}
                                    {summary.warning > 0 && (
                                        <div
                                            className="h-full"
                                            style={{
                                                width: `${(summary.warning / breakdownTotal) * 100}%`,
                                                backgroundColor: chartConfig.warning.color,
                                            }}
                                        />
                                    )}
                                    {summary.success > 0 && (
                                        <div
                                            className="h-full"
                                            style={{
                                                width: `${(summary.success / breakdownTotal) * 100}%`,
                                                backgroundColor: chartConfig.success.color,
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600">
                                    {copyLabels.noIssuesMessage}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                {(['error', 'warning', 'success'] as const).map((key) => (
                                    <span
                                        key={key}
                                        className="flex items-center gap-1.5 text-xs text-slate-600"
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: chartConfig[key].color }}
                                            aria-hidden="true"
                                        />
                                        {chartConfig[key].label}
                                    </span>
                                ))}
                            </div>

                            {hasEnoughFamiliesForRadar ? (
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-85"
                                >
                                    <RadarChart
                                        data={chartData}
                                        margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
                                    >
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                        />
                                        <PolarGrid />
                                        <PolarAngleAxis
                                            dataKey="metricGroup"
                                            tick={{ fontSize: 11 }}
                                        />
                                        <PolarRadiusAxis
                                            tick={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <Radar
                                            name={copyLabels.errorLabel}
                                            dataKey="error"
                                            stroke="var(--color-error)"
                                            fill="var(--color-error)"
                                            fillOpacity={0.1}
                                            strokeWidth={2}
                                        />
                                        <Radar
                                            name={copyLabels.warningLabel}
                                            dataKey="warning"
                                            stroke="var(--color-warning)"
                                            fill="var(--color-warning)"
                                            fillOpacity={0.1}
                                            strokeWidth={2}
                                        />
                                        <Radar
                                            name={copyLabels.healthyLabel}
                                            dataKey="success"
                                            stroke="var(--color-success)"
                                            fill="var(--color-success)"
                                            fillOpacity={0.1}
                                            strokeWidth={2}
                                        />
                                    </RadarChart>
                                </ChartContainer>
                            ) : (
                                <div className="space-y-3">
                                    {chartData.map((group) => {
                                        const total = group.error + group.warning + group.success;

                                        return (
                                            <div key={group.metricGroup} className="space-y-1.5">
                                                <div className="flex items-center justify-between gap-2 text-xs">
                                                    <span className="font-medium text-slate-900">
                                                        {group.metricGroup}
                                                    </span>
                                                    <span className="text-slate-500">
                                                        {total}{' '}
                                                        {copyLabels.impactedChecksLabel.toLowerCase()}
                                                    </span>
                                                </div>
                                                <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                    {group.error > 0 && (
                                                        <div
                                                            className="h-full"
                                                            style={{
                                                                width: `${(group.error / total) * 100}%`,
                                                                backgroundColor:
                                                                    chartConfig.error.color,
                                                            }}
                                                        />
                                                    )}
                                                    {group.warning > 0 && (
                                                        <div
                                                            className="h-full"
                                                            style={{
                                                                width: `${(group.warning / total) * 100}%`,
                                                                backgroundColor:
                                                                    chartConfig.warning.color,
                                                            }}
                                                        />
                                                    )}
                                                    {group.success > 0 && (
                                                        <div
                                                            className="h-full"
                                                            style={{
                                                                width: `${(group.success / total) * 100}%`,
                                                                backgroundColor:
                                                                    chartConfig.success.color,
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
                <CardContent className="space-y-4 p-5">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                            {copyLabels.priorityFindingsTitle}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600">
                            {copyLabels.priorityFindingsDescription}
                        </p>
                    </div>

                    {priorityFindings.length ? (
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            {priorityFindings.map((finding) => {
                                return (
                                    <div
                                        key={`${finding.statusKey}-${finding.label}`}
                                        className="rounded-lg border border-slate-200 bg-white p-3"
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-slate-900 break-words">
                                                {finding.label}
                                            </p>
                                            <Badge
                                                className={getStatusBadgeClassName(
                                                    finding.statusKey,
                                                )}
                                            >
                                                {finding.statusKey}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-medium text-slate-700">
                                            {copyLabels.impactedChecksLabel}:{' '}
                                            {finding.impactedChecks}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600">{copyLabels.noIssuesMessage}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalityAuditReportsSection;

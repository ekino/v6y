import * as React from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

import { useTranslationProvider } from '@v6y/ui-kit';
import {
    AlertTriangle,
    Bug,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    Check,
    CircleHelp,
    Clipboard,
    FileText,
    Link,
    Lock,
    Settings,
    Shield,
    Unlock,
    Wind,
    Wrench,
    X,
} from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsAuditReportsByParams from '../../api/getApplicationDetailsAuditReportsByParams';

interface VitalitySonarQubeViewProps {
    applicationId: number;
    sonarqubeUrl: string;
    auditTrigger?: number;
}

interface AuditReport {
    _id?: number | null;
    type?: string | null;
    category?: string | null;
    subCategory?: string | null;
    auditStatus?: string | null;
    scoreStatus?: string | null;
    score?: number | null;
    scoreUnit?: string | null;
    extraInfos?: string | null;
}

const getQualityGateStyle = (status: string | undefined) => {
    switch (status) {
        case 'OK':
            return {
                icon: <Check className="w-3.5 h-3.5" aria-hidden="true" />,
                label: 'Passed',
            };
        case 'ERROR':
            return {
                icon: <X className="w-3.5 h-3.5" aria-hidden="true" />,
                label: 'Failed',
            };
        case 'WARN':
            return {
                icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
                label: 'Warning',
            };
        default:
            return {
                icon: <CircleHelp className="w-3.5 h-3.5" aria-hidden="true" />,
                label: status || 'Unknown',
            };
    }
};

const RATING_SCORE: Record<string, number> = { A: 100, B: 80, C: 60, D: 40, E: 20 };

// SonarQube rating metrics (reliability, security, maintainability) report
// their value as a 1-5 numeric scale (1 = A, 5 = E) rather than the letter
// itself; `subCategory` sometimes carries the letter directly, so prefer it
// and fall back to converting the numeric score otherwise.
const NUMERIC_RATING_GRADE: Record<number, string> = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };

const getRatingGrade = (report: AuditReport | undefined): string | undefined => {
    if (report?.subCategory) {
        return report.subCategory;
    }

    if (report?.score !== null && report?.score !== undefined) {
        return NUMERIC_RATING_GRADE[Math.round(report.score)];
    }

    return undefined;
};

const getRatingStyle = (rating: string | undefined) => {
    switch (rating) {
        case 'A':
            return { desc: 'Excellent' };
        case 'B':
            return { desc: 'Good' };
        case 'C':
            return { desc: 'Fair' };
        case 'D':
            return { desc: 'Poor' };
        case 'E':
            return { desc: 'Critical' };
        default:
            return { desc: '' };
    }
};

const METRIC_DISPLAY: Record<
    string,
    { label: string; icon: React.ReactNode; unit?: string; subtitle: string }
> = {
    coverage: {
        label: 'Coverage',
        icon: <Shield className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '%',
        subtitle: 'Code covered by tests',
    },
    bugs: {
        label: 'Bugs',
        icon: <Bug className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Reliability issues found',
    },
    vulnerabilities: {
        label: 'Vulnerabilities',
        icon: <Unlock className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Security issues found',
    },
    code_smells: {
        label: 'Code Smells',
        icon: <Wind className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Maintainability issues',
    },
    duplicated_lines_density: {
        label: 'Duplications',
        icon: <Clipboard className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '%',
        subtitle: 'Duplicated code blocks',
    },
    ncloc: {
        label: 'Lines of Code',
        icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Non-comment lines',
    },
    reliability_rating: {
        label: 'Reliability',
        icon: <Settings className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Bug-free grade (A–E)',
    },
    security_rating: {
        label: 'Security',
        icon: <Lock className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Vulnerability grade (A–E)',
    },
    sqale_rating: {
        label: 'Maintainability',
        icon: <Wrench className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        subtitle: 'Technical debt grade (A–E)',
    },
};

const RATING_KEYS = new Set(['reliability_rating', 'security_rating', 'sqale_rating']);

const repartitionConfig = {
    value: { label: 'Score' },
} satisfies ChartConfig;

const VitalitySonarQubeView = ({
    applicationId,
    sonarqubeUrl,
    auditTrigger = 0,
}: VitalitySonarQubeViewProps) => {
    const { translate } = useTranslationProvider();

    const { isLoading, data } = useClientQuery<{
        getApplicationDetailsAuditReportsByParams: AuditReport[];
    }>({
        queryCacheKey: [
            'getApplicationDetailsAuditReportsByParams-sonarqube',
            `${applicationId}`,
            `${auditTrigger}`,
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetApplicationDetailsAuditReportsByParams,
                variables: { _id: applicationId },
            }),
    });

    const auditReports = React.useMemo(
        () =>
            (data?.getApplicationDetailsAuditReportsByParams || []).filter(
                (r) => r.type === 'sonarqube',
            ),
        [data],
    );

    const qualityGateRecord = React.useMemo(
        () => auditReports.find((r) => r.category === 'quality_gate'),
        [auditReports],
    );

    const qualityGateStatus = qualityGateRecord?.subCategory ?? undefined;
    const qualityGateStyle = getQualityGateStyle(qualityGateStatus);

    const qualityGateExtra = React.useMemo(() => {
        try {
            return qualityGateRecord?.extraInfos
                ? (JSON.parse(qualityGateRecord.extraInfos) as {
                      projectKey?: string;
                      baseUrl?: string;
                  })
                : null;
        } catch {
            return null;
        }
    }, [qualityGateRecord]);

    const metricMap = React.useMemo(() => {
        const map: Record<string, AuditReport> = {};
        auditReports.forEach((r) => {
            if (r.category && r.category !== 'quality_gate') map[r.category] = r;
        });
        return map;
    }, [auditReports]);

    const hasData = auditReports.length > 0;

    const repartitionData = React.useMemo(() => {
        const entries: { axis: string; value: number }[] = [];
        const clamp = (value: number) => Math.max(0, Math.min(100, value));

        const coverageReport = metricMap.coverage;
        if (coverageReport?.score !== null && coverageReport?.score !== undefined) {
            entries.push({
                axis: METRIC_DISPLAY.coverage.label,
                value: clamp(coverageReport.score),
            });
        }

        const duplicationReport = metricMap.duplicated_lines_density;
        if (duplicationReport?.score !== null && duplicationReport?.score !== undefined) {
            entries.push({ axis: 'Low duplication', value: clamp(100 - duplicationReport.score) });
        }

        (['reliability_rating', 'security_rating', 'sqale_rating'] as const).forEach((key) => {
            const grade = getRatingGrade(metricMap[key]);
            const score = grade ? RATING_SCORE[grade] : undefined;
            if (score !== undefined) {
                entries.push({ axis: METRIC_DISPLAY[key].label, value: score });
            }
        });

        return entries;
    }, [metricMap]);

    // A radar chart needs at least 3 axes to draw a legible polygon; below
    // that it degenerates to a single spoke or a flat line.
    const hasEnoughMetricsForRadar = repartitionData.length >= 3;

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-lg text-gray-900">
                            {translate('vitality.appDetailsPage.sonarqube.title')}
                        </CardTitle>
                        {qualityGateExtra?.projectKey && (
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-xs">
                                {qualityGateExtra.projectKey}
                            </span>
                        )}
                    </div>
                    {/* Quality Gate inline badge */}
                    {!isLoading && hasData && qualityGateStatus && (
                        <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            {qualityGateStyle.icon} Quality Gate: {qualityGateStyle.label}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                {/* No data yet */}
                {!isLoading && !hasData && (
                    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                            {translate('vitality.appDetailsPage.sonarqube.noData')}
                        </span>
                    </div>
                )}

                {/* Reports repartition */}
                {!isLoading && hasData && (
                    <div className="space-y-2 rounded-lg border border-slate-100 bg-white px-4 py-3">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-900">
                                {translate('vitality.appDetailsPage.sonarqube.repartitionTitle')}
                            </h4>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {translate(
                                    'vitality.appDetailsPage.sonarqube.repartitionDescription',
                                )}
                            </p>
                        </div>

                        {hasEnoughMetricsForRadar ? (
                            <ChartContainer
                                config={repartitionConfig}
                                className="mx-auto aspect-square max-h-64"
                            >
                                <RadarChart
                                    data={repartitionData}
                                    margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
                                >
                                    <ChartTooltip
                                        content={<ChartTooltipContent hideLabel nameKey="axis" />}
                                    />
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                                    <PolarRadiusAxis
                                        tick={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                    />
                                    <Radar
                                        dataKey="value"
                                        fill="#0f172a"
                                        fillOpacity={0.16}
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                        dot={{ r: 3, fillOpacity: 1 }}
                                    />
                                </RadarChart>
                            </ChartContainer>
                        ) : (
                            <p className="text-xs text-slate-500">
                                {translate(
                                    'vitality.appDetailsPage.sonarqube.repartitionUnavailable',
                                )}
                            </p>
                        )}
                    </div>
                )}

                {/* Metrics Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-slate-100 p-4 space-y-2"
                            >
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                                <div className="h-8 bg-slate-100 rounded w-3/4" />
                                <div className="h-2.5 bg-slate-100 rounded w-full" />
                            </div>
                        ))}
                    </div>
                ) : hasData ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(METRIC_DISPLAY).map(([key, config]) => {
                            const report = metricMap[key];
                            if (!report) return null;
                            const isRating = RATING_KEYS.has(key);
                            const grade = isRating ? getRatingGrade(report) : undefined;
                            const ratingStyle = isRating ? getRatingStyle(grade) : null;
                            const displayValue =
                                report.score !== null && report.score !== undefined
                                    ? String(report.score)
                                    : '—';
                            return (
                                <div
                                    key={key}
                                    className="rounded-lg border border-slate-100 bg-white px-4 py-3 flex flex-col gap-2"
                                >
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <span className="shrink-0">{config.icon}</span>
                                        <span>{config.label}</span>
                                    </span>
                                    {isRating && grade ? (
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-900 text-white text-2xl font-bold shrink-0">
                                                {grade}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {ratingStyle!.desc}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-3xl font-bold leading-none text-slate-900">
                                            {displayValue}
                                            {report.scoreUnit && (
                                                <span className="text-base font-normal text-slate-400 ml-1">
                                                    {report.scoreUnit}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-400">
                                        {config.subtitle}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : null}

                {/* Project URL */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <a
                        href={sonarqubeUrl}
                        className="text-xs text-slate-500 hover:text-slate-700 hover:underline truncate font-mono"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {sonarqubeUrl}
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};

export default VitalitySonarQubeView;

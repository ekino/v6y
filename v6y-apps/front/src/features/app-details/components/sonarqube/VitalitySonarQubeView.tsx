import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import {
    AlertTriangle,
    Bug,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200',
                icon: <Check className="w-3.5 h-3.5" aria-hidden="true" />,
                label: 'Passed',
            };
        case 'ERROR':
            return {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: <X className="w-3.5 h-3.5" aria-hidden="true" />,
                label: 'Failed',
            };
        case 'WARN':
            return {
                bg: 'bg-yellow-50',
                text: 'text-yellow-700',
                border: 'border-yellow-200',
                icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
                label: 'Warning',
            };
        default:
            return {
                bg: 'bg-slate-50',
                text: 'text-slate-600',
                border: 'border-slate-200',
                icon: <CircleHelp className="w-3.5 h-3.5" aria-hidden="true" />,
                label: status || 'Unknown',
            };
    }
};

const getRatingStyle = (rating: string | undefined) => {
    switch (rating) {
        case 'A':
            return { cls: 'bg-green-500 text-white', desc: 'Excellent' };
        case 'B':
            return { cls: 'bg-lime-500 text-white', desc: 'Good' };
        case 'C':
            return { cls: 'bg-yellow-500 text-white', desc: 'Fair' };
        case 'D':
            return { cls: 'bg-orange-500 text-white', desc: 'Poor' };
        case 'E':
            return { cls: 'bg-red-500 text-white', desc: 'Critical' };
        default:
            return { cls: 'bg-slate-400 text-white', desc: '' };
    }
};

const METRIC_DISPLAY: Record<
    string,
    { label: string; icon: React.ReactNode; unit?: string; color: string; subtitle: string }
> = {
    coverage: {
        label: 'Coverage',
        icon: <Shield className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '%',
        color: 'text-blue-700',
        subtitle: 'Code covered by tests',
    },
    bugs: {
        label: 'Bugs',
        icon: <Bug className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-red-700',
        subtitle: 'Reliability issues found',
    },
    vulnerabilities: {
        label: 'Vulnerabilities',
        icon: <Unlock className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-orange-700',
        subtitle: 'Security issues found',
    },
    code_smells: {
        label: 'Code Smells',
        icon: <Wind className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-yellow-700',
        subtitle: 'Maintainability issues',
    },
    duplicated_lines_density: {
        label: 'Duplications',
        icon: <Clipboard className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '%',
        color: 'text-purple-700',
        subtitle: 'Duplicated code blocks',
    },
    ncloc: {
        label: 'Lines of Code',
        icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-slate-700',
        subtitle: 'Non-comment lines',
    },
    reliability_rating: {
        label: 'Reliability',
        icon: <Settings className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-blue-700',
        subtitle: 'Bug-free grade (A–E)',
    },
    security_rating: {
        label: 'Security',
        icon: <Lock className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-orange-700',
        subtitle: 'Vulnerability grade (A–E)',
    },
    sqale_rating: {
        label: 'Maintainability',
        icon: <Wrench className="w-3.5 h-3.5" aria-hidden="true" />,
        unit: '',
        color: 'text-green-700',
        subtitle: 'Technical debt grade (A–E)',
    },
};

const RATING_KEYS = new Set(['reliability_rating', 'security_rating', 'sqale_rating']);

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
                        <span
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${qualityGateStyle.bg} ${qualityGateStyle.border} ${qualityGateStyle.text}`}
                        >
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
                            const grade = isRating ? (report.subCategory ?? undefined) : undefined;
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
                                    <span className="text-xs font-medium text-slate-500">
                                        {config.icon} {config.label}
                                    </span>
                                    {isRating && grade ? (
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`inline-flex items-center justify-center w-11 h-11 rounded-full text-2xl font-bold shrink-0 ${ratingStyle!.cls}`}
                                            >
                                                {grade}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {ratingStyle!.desc}
                                            </span>
                                        </div>
                                    ) : (
                                        <span
                                            className={`text-3xl font-bold leading-none ${config.color}`}
                                        >
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
                        className="text-xs text-blue-500 hover:text-blue-700 hover:underline truncate font-mono"
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

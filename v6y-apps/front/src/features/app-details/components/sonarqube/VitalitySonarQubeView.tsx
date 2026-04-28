import * as React from 'react';

import { useTranslationProvider } from '@v6y/ui-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetSonarQubeMetrics from '../../api/getSonarQubeMetrics';

interface VitalitySonarQubeViewProps {
    applicationId: number;
    sonarqubeUrl: string;
}

const extractProjectKey = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        return (
            urlObj.searchParams.get('id') ||
            urlObj.searchParams.get('project') ||
            urlObj.searchParams.get('projectKey') ||
            null
        );
    } catch {
        return null;
    }
};

const getQualityGateStyle = (status: string | undefined) => {
    switch (status) {
        case 'OK':
            return {
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200',
                icon: '✅',
                label: 'Passed',
            };
        case 'ERROR':
            return {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: '❌',
                label: 'Failed',
            };
        case 'WARN':
            return {
                bg: 'bg-yellow-50',
                text: 'text-yellow-700',
                border: 'border-yellow-200',
                icon: '⚠️',
                label: 'Warning',
            };
        default:
            return {
                bg: 'bg-slate-50',
                text: 'text-slate-600',
                border: 'border-slate-200',
                icon: '❓',
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

/** SonarCloud returns float strings like "5.0" — normalise to letter grade */
const resolveRating = (
    value: string | null | undefined,
    rating: string | null | undefined,
): string | undefined => {
    if (rating && /^[A-E]$/.test(rating)) return rating;
    if (value) {
        const n = Math.round(parseFloat(value));
        const map: Record<number, string> = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
        if (map[n]) return map[n];
    }
    return undefined;
};

const METRIC_DISPLAY: Record<
    string,
    { label: string; icon: string; unit?: string; color: string; subtitle: string }
> = {
    coverage: {
        label: 'Coverage',
        icon: '🛡️',
        unit: '%',
        color: 'text-blue-700',
        subtitle: 'Code covered by tests',
    },
    bugs: {
        label: 'Bugs',
        icon: '🐛',
        unit: '',
        color: 'text-red-700',
        subtitle: 'Reliability issues found',
    },
    vulnerabilities: {
        label: 'Vulnerabilities',
        icon: '🔓',
        unit: '',
        color: 'text-orange-700',
        subtitle: 'Security issues found',
    },
    code_smells: {
        label: 'Code Smells',
        icon: '💨',
        unit: '',
        color: 'text-yellow-700',
        subtitle: 'Maintainability issues',
    },
    duplicated_lines_density: {
        label: 'Duplications',
        icon: '📋',
        unit: '%',
        color: 'text-purple-700',
        subtitle: 'Duplicated code blocks',
    },
    ncloc: {
        label: 'Lines of Code',
        icon: '📄',
        unit: '',
        color: 'text-slate-700',
        subtitle: 'Non-comment lines',
    },
    reliability_rating: {
        label: 'Reliability',
        icon: '⚙️',
        unit: '',
        color: 'text-blue-700',
        subtitle: 'Bug-free grade (A–E)',
    },
    security_rating: {
        label: 'Security',
        icon: '🔒',
        unit: '',
        color: 'text-orange-700',
        subtitle: 'Vulnerability grade (A–E)',
    },
    sqale_rating: {
        label: 'Maintainability',
        icon: '🔧',
        unit: '',
        color: 'text-green-700',
        subtitle: 'Technical debt grade (A–E)',
    },
};

const RATING_KEYS = new Set(['reliability_rating', 'security_rating', 'sqale_rating']);

interface SonarMetric {
    key?: string | null;
    name?: string | null;
    value?: string | null;
    rating?: string | null;
}

interface SonarData {
    success?: boolean | null;
    error?: string | null;
    projectKey?: string | null;
    baseUrl?: string | null;
    qualityGate?: { status?: string | null; name?: string | null } | null;
    metrics?: SonarMetric[] | null;
}

const VitalitySonarQubeView = ({ applicationId, sonarqubeUrl }: VitalitySonarQubeViewProps) => {
    const { translate } = useTranslationProvider();
    const projectKey = React.useMemo(() => extractProjectKey(sonarqubeUrl), [sonarqubeUrl]);

    const { isLoading, data } = useClientQuery<{ getSonarQubeMetrics: SonarData }>({
        queryCacheKey: ['getSonarQubeMetrics', `${applicationId}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetSonarQubeMetrics,
                variables: { _id: applicationId },
            }),
    });

    const sonarData = data?.getSonarQubeMetrics;
    const qualityGateStyle = getQualityGateStyle(sonarData?.qualityGate?.status ?? undefined);

    const metricMap = React.useMemo(() => {
        const map: Record<string, SonarMetric> = {};
        sonarData?.metrics?.forEach((m) => {
            if (m.key) map[m.key] = m;
        });
        return map;
    }, [sonarData]);

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-lg text-gray-900">
                            {translate('vitality.appDetailsPage.sonarqube.title')}
                        </CardTitle>
                        {(sonarData?.projectKey || projectKey) && (
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-xs">
                                {sonarData?.projectKey || projectKey}
                            </span>
                        )}
                    </div>
                    {/* Quality Gate inline badge */}
                    {!isLoading && sonarData?.success && (
                        <span
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${qualityGateStyle.bg} ${qualityGateStyle.border} ${qualityGateStyle.text}`}
                        >
                            {qualityGateStyle.icon} Quality Gate: {qualityGateStyle.label}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
                {/* Error state */}
                {!isLoading && sonarData?.error && (
                    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        ⚠️ {sonarData.error}
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
                ) : sonarData?.success && sonarData.metrics && sonarData.metrics.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(METRIC_DISPLAY).map(([key, config]) => {
                            const metric = metricMap[key];
                            if (!metric) return null;
                            const isRating = RATING_KEYS.has(key);
                            const displayValue = metric.value ?? '—';
                            const grade = isRating
                                ? resolveRating(metric.value, metric.rating)
                                : undefined;
                            const ratingStyle = isRating ? getRatingStyle(grade) : null;
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
                                            {config.unit && (
                                                <span className="text-base font-normal text-slate-400 ml-1">
                                                    {config.unit}
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
                    <span className="text-xs text-slate-400 shrink-0">🔗</span>
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

'use client';

import Link from 'next/link';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useTranslationProvider } from '@v6y/ui-kit';
import {
    Button,
    Card,
    CardContent,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    Skeleton,
    TrendingUp,
} from '@v6y/ui-kit-front';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { parseDateValue } from '../../../commons/utils/DateParamUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetAllAuditRuns from '../../app-details/api/getAllAuditRuns';

interface AuditRunType {
    triggeredAt: string;
    analysisTypes?: string[] | null;
}

type CategoryKey = 'static' | 'dynamic' | 'devops' | 'other';
type Granularity = 'day' | 'week' | 'month';

const CATEGORY_KEYS: CategoryKey[] = ['static', 'dynamic', 'devops', 'other'];

// Analysis history is capped to a year so a single very old outlier run
// doesn't stretch the whole chart into meaninglessness.
const MAX_WINDOW_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const startOfDay = (date: Date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

const startOfWeekMonday = (date: Date) => {
    const result = startOfDay(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    return result;
};

const startOfMonth = (date: Date) => {
    const result = startOfDay(date);
    result.setDate(1);
    return result;
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const addMonths = (date: Date, months: number) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

const resolveGranularity = (spanDays: number): Granularity => {
    if (spanDays <= 14) return 'day';
    if (spanDays <= 90) return 'week';
    return 'month';
};

const startOfPeriod = (date: Date, granularity: Granularity) => {
    if (granularity === 'day') return startOfDay(date);
    if (granularity === 'week') return startOfWeekMonday(date);
    return startOfMonth(date);
};

const nextPeriod = (date: Date, granularity: Granularity) => {
    if (granularity === 'day') return addDays(date, 1);
    if (granularity === 'week') return addDays(date, 7);
    return addMonths(date, 1);
};

const formatDay = (date: Date) =>
    date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });

const formatMonth = (date: Date) =>
    date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const bucketLabel = (start: Date, end: Date, granularity: Granularity) => {
    if (granularity === 'day') return formatDay(start);
    if (granularity === 'week') return `${formatDay(start)} - ${formatDay(end)}`;
    return formatMonth(start);
};

const normalizeCategory = (type: string): CategoryKey => {
    const normalized = type?.toLowerCase();
    return normalized === 'static' || normalized === 'dynamic' || normalized === 'devops'
        ? normalized
        : 'other';
};

const VitalityDashboardReportsChart = () => {
    const { translate } = useTranslationProvider();

    const { isLoading, data } = useClientQuery<{ getAllAuditRuns?: AuditRunType[] }>({
        queryCacheKey: ['dashboard', 'getAllAuditRuns'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetAllAuditRuns,
                variables: {},
            }),
    });

    const { chartData, activeCategories, granularity, hasData } = React.useMemo(() => {
        const runs = (data?.getAllAuditRuns || [])
            .map((run) => ({ ...run, triggeredDate: parseDateValue(run.triggeredAt) }))
            .filter(
                (run): run is typeof run & { triggeredDate: Date } => run.triggeredDate !== null,
            );

        if (!runs.length) {
            return {
                chartData: [] as Array<Record<string, number | string>>,
                activeCategories: [] as CategoryKey[],
                granularity: 'week' as Granularity,
                hasData: false,
            };
        }

        const now = new Date();
        const oldestTriggeredAt = runs.reduce(
            (oldest, run) => (run.triggeredDate < oldest ? run.triggeredDate : oldest),
            now,
        );
        const earliestAllowed = new Date(now.getTime() - MAX_WINDOW_DAYS * DAY_MS);
        const windowStart =
            oldestTriggeredAt > earliestAllowed ? oldestTriggeredAt : earliestAllowed;

        const spanDays = Math.max(1, Math.ceil((now.getTime() - windowStart.getTime()) / DAY_MS));
        const resolvedGranularity = resolveGranularity(spanDays);

        const buckets: Record<string, Record<CategoryKey, number>> = {};
        const labels: Record<string, string> = {};
        const order: string[] = [];

        let cursor = startOfPeriod(windowStart, resolvedGranularity);
        while (cursor <= now) {
            const key = toDateKey(cursor);
            const periodEnd = nextPeriod(cursor, resolvedGranularity);
            const displayEnd = periodEnd > now ? now : addDays(periodEnd, -1);
            buckets[key] = { static: 0, dynamic: 0, devops: 0, other: 0 };
            labels[key] = bucketLabel(cursor, displayEnd, resolvedGranularity);
            order.push(key);
            cursor = periodEnd;
        }

        const categoryTotals: Record<CategoryKey, number> = {
            static: 0,
            dynamic: 0,
            devops: 0,
            other: 0,
        };

        runs.forEach((run) => {
            if (run.triggeredDate < windowStart || run.triggeredDate > now) {
                return;
            }

            const key = toDateKey(startOfPeriod(run.triggeredDate, resolvedGranularity));
            if (!(key in buckets)) {
                return;
            }

            const types = run.analysisTypes?.length ? run.analysisTypes : ['other'];
            const seenCategories = new Set(types.map(normalizeCategory));
            seenCategories.forEach((category) => {
                buckets[key][category] += 1;
                categoryTotals[category] += 1;
            });
        });

        const resolvedActiveCategories = CATEGORY_KEYS.filter(
            (category) => categoryTotals[category] > 0,
        );

        return {
            chartData: order.map((key) => ({
                period: labels[key],
                ...buckets[key],
            })),
            activeCategories: resolvedActiveCategories,
            granularity: resolvedGranularity,
            hasData:
                categoryTotals.static +
                    categoryTotals.dynamic +
                    categoryTotals.devops +
                    categoryTotals.other >
                0,
        };
    }, [data]);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-4 w-80" />
                <Skeleton className="h-[280px] w-full" />
            </div>
        );
    }

    if (!hasData) {
        return (
            <Card className="border-dashed border-slate-300 bg-slate-50/60 shadow-none">
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/5 text-slate-500">
                        <TrendingUp className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">
                        {translate('vitality.dashboardPage.reportsTrendEmptyTitle')}
                    </h3>
                    <p className="max-w-[52ch] text-sm text-slate-600">
                        {translate('vitality.dashboardPage.reportsTrendEmptyDescription')}
                    </p>
                    <Button asChild size="sm" className="mt-1">
                        <Link href="/app-list">
                            {translate('vitality.dashboardPage.reportsTrendEmptyCta')}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const chartConfig = {
        static: {
            label: translate('vitality.dashboardPage.reportsTrendLegendStatic'),
            color: '#1f1f1f',
        },
        dynamic: {
            label: translate('vitality.dashboardPage.reportsTrendLegendDynamic'),
            color: '#5c5c5c',
        },
        devops: {
            label: translate('vitality.dashboardPage.reportsTrendLegendDevops'),
            color: '#8f8f8f',
        },
        other: {
            label: translate('vitality.dashboardPage.reportsTrendLegendOther'),
            color: '#c2c2c2',
        },
    } satisfies ChartConfig;

    const subtitleKey =
        granularity === 'day'
            ? 'vitality.dashboardPage.reportsTrendSubtitleDaily'
            : granularity === 'week'
              ? 'vitality.dashboardPage.reportsTrendSubtitleWeekly'
              : 'vitality.dashboardPage.reportsTrendSubtitleMonthly';

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        {translate('vitality.dashboardPage.reportsTrendTitle')}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">{translate(subtitleKey)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {activeCategories.map((category) => (
                        <span
                            key={category}
                            className="flex items-center gap-1.5 text-xs text-slate-600"
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: chartConfig[category].color }}
                                aria-hidden="true"
                            />
                            {chartConfig[category].label}
                        </span>
                    ))}
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto">
                <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
                    <defs>
                        {activeCategories.map((category) => (
                            <linearGradient
                                key={category}
                                id={`fill-${category}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={`var(--color-${category})`}
                                    stopOpacity={0.45}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={`var(--color-${category})`}
                                    stopOpacity={0.06}
                                />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="period"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={18}
                    />
                    <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    {activeCategories.map((category) => (
                        <Area
                            key={category}
                            dataKey={category}
                            stackId="reports"
                            type="natural"
                            fill={`url(#fill-${category})`}
                            stroke={`var(--color-${category})`}
                            strokeWidth={2}
                        />
                    ))}
                </AreaChart>
            </ChartContainer>
        </div>
    );
};

export default VitalityDashboardReportsChart;

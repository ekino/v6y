'use client';

import * as React from 'react';

import { Charts, LoaderView, useTranslationProvider } from '@v6y/ui-kit';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetAllAuditRuns from '../../app-details/api/getAllAuditRuns';

interface AuditRunType {
    triggeredAt: string;
}

const LOOKBACK_DAYS = 30;

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const startOfWeekMonday = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);
    return result;
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatShortDate = (date: Date) =>
    date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
    });

const VitalityDashboardReportsChart = () => {
    const { translate } = useTranslationProvider();

    const { isLoading, data } = useClientQuery<{ getAllAuditRuns?: AuditRunType[] }>({
        queryCacheKey: ['dashboard', 'getAllAuditRuns', `${LOOKBACK_DAYS}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL as string,
                query: GetAllAuditRuns,
                variables: {},
            }),
    });

    const chartData = React.useMemo(() => {
        const runs = data?.getAllAuditRuns || [];
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        const windowStart = addDays(now, -(LOOKBACK_DAYS - 1));
        windowStart.setHours(0, 0, 0, 0);

        const buckets: Record<string, number> = {};
        const labels: Record<string, string> = {};

        let cursor = startOfWeekMonday(windowStart);
        while (cursor <= now) {
            const key = toDateKey(cursor);
            const weekEnd = addDays(cursor, 6) > now ? now : addDays(cursor, 6);
            buckets[key] = 0;
            labels[key] = `${formatShortDate(cursor)} - ${formatShortDate(weekEnd)}`;
            cursor = addDays(cursor, 7);
        }

        runs.forEach((run) => {
            const triggeredAt = run?.triggeredAt ? new Date(run.triggeredAt) : null;
            if (!triggeredAt || Number.isNaN(triggeredAt.getTime())) {
                return;
            }

            if (triggeredAt < windowStart || triggeredAt > now) {
                return;
            }

            const key = toDateKey(startOfWeekMonday(triggeredAt));
            if (key in buckets) {
                buckets[key] += 1;
            }
        });

        return Object.keys(buckets).map((key) => ({
            week: labels[key],
            reports: buckets[key],
        }));
    }, [data]);

    if (isLoading) {
        return <LoaderView />;
    }

    return (
        <Charts
            options={{
                theme: 'ag-vivid',
                data: chartData,
                title: {
                    text: translate('vitality.dashboardPage.reportsTrendTitle'),
                },
                subtitle: {
                    text: translate('vitality.dashboardPage.reportsTrendSubtitle'),
                },
                series: [
                    {
                        type: 'area',
                        xKey: 'week',
                        yKey: 'reports',
                        yName: translate('vitality.dashboardPage.reportsTrendLegend'),
                        stroke: '#0f172a',
                        fill: '#cbd5e1',
                        fillOpacity: 0.35,
                        strokeWidth: 2,
                        marker: {
                            enabled: true,
                            size: 4,
                            fill: '#0f172a',
                            strokeWidth: 0,
                        },
                    },
                ],
                legend: {
                    enabled: false,
                },
                overlays: {
                    noData: {
                        text: translate('vitality.dashboardPage.reportsTrendEmpty'),
                    },
                },
            }}
        />
    );
};

export default VitalityDashboardReportsChart;

'use client';

import * as React from 'react';

import { AuditType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit';
import { AlertTriangle, Check, ClipboardList, X } from '@v6y/ui-kit-front';

import VitalitySummaryStatBar, { VitalitySummaryStatItem } from './VitalitySummaryStatBar';

interface VitalityAuditReportsSummaryProps {
    reports: AuditType[];
}

type NormalizedStatus = 'success' | 'warning' | 'error' | 'unknown';

const normalizeStatus = (status?: string | null): NormalizedStatus => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'success' || normalized === 'good') {
        return 'success';
    }
    if (normalized === 'warning') {
        return 'warning';
    }
    if (['error', 'failure', 'failed', 'fail'].includes(normalized)) {
        return 'error';
    }
    return 'unknown';
};

const VitalityAuditReportsSummary = ({ reports }: VitalityAuditReportsSummaryProps) => {
    const { translate } = useTranslationProvider();

    const counts = React.useMemo(() => {
        const result: Record<NormalizedStatus, number> = {
            success: 0,
            warning: 0,
            error: 0,
            unknown: 0,
        };
        reports.forEach((report) => {
            const status = normalizeStatus(report.scoreStatus || report.auditStatus);
            result[status] += 1;
        });
        return result;
    }, [reports]);

    const total = reports.length;

    if (!total) {
        return null;
    }

    const statItems: VitalitySummaryStatItem[] = [
        {
            key: 'total',
            label: translate('vitality.appDetailsPage.auditReports.summary.total'),
            value: total,
            icon: ClipboardList,
            tone: 'neutral',
        },
        {
            key: 'success',
            label: translate('vitality.appDetailsPage.auditReports.summary.passed'),
            value: counts.success,
            icon: Check,
            tone: 'success',
        },
        {
            key: 'warning',
            label: translate('vitality.appDetailsPage.auditReports.summary.warnings'),
            value: counts.warning,
            icon: AlertTriangle,
            tone: 'warning',
        },
        {
            key: 'error',
            label: translate('vitality.appDetailsPage.auditReports.summary.issues'),
            value: counts.error,
            icon: X,
            tone: 'error',
        },
    ];

    return <VitalitySummaryStatBar items={statItems} />;
};

export default VitalityAuditReportsSummary;

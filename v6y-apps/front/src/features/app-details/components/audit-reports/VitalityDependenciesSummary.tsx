'use client';

import * as React from 'react';

import { DependencyType } from '@v6y/core-logic/src/types';
import { useTranslationProvider } from '@v6y/ui-kit';
import { AlertTriangle, Check, ClipboardList, X } from '@v6y/ui-kit-front';

import {
    NormalizedDependencyStatus,
    classifyDependencyStatus,
} from '../../../../commons/utils/StatusUtils';
import VitalitySummaryStatBar, { VitalitySummaryStatItem } from './VitalitySummaryStatBar';

interface VitalityDependenciesSummaryProps {
    dependencies: DependencyType[];
}

const VitalityDependenciesSummary = ({ dependencies }: VitalityDependenciesSummaryProps) => {
    const { translate } = useTranslationProvider();

    const counts = React.useMemo(() => {
        const result: Record<NormalizedDependencyStatus, number> = {
            success: 0,
            warning: 0,
            error: 0,
            unknown: 0,
        };
        dependencies.forEach((dependency) => {
            result[classifyDependencyStatus(dependency.status)] += 1;
        });
        return result;
    }, [dependencies]);

    const total = dependencies.length;

    if (!total) {
        return null;
    }

    const statItems: VitalitySummaryStatItem[] = [
        {
            key: 'total',
            label: translate('vitality.appDetailsPage.dependencies.summary.total'),
            value: total,
            icon: ClipboardList,
            tone: 'neutral',
        },
        {
            key: 'success',
            label: translate('vitality.appDetailsPage.dependencies.summary.upToDate'),
            value: counts.success,
            icon: Check,
            tone: 'success',
        },
        {
            key: 'warning',
            label: translate('vitality.appDetailsPage.dependencies.summary.warnings'),
            value: counts.warning,
            icon: AlertTriangle,
            tone: 'warning',
        },
        {
            key: 'error',
            label: translate('vitality.appDetailsPage.dependencies.summary.critical'),
            value: counts.error,
            icon: X,
            tone: 'error',
        },
    ];

    return <VitalitySummaryStatBar items={statItems} />;
};

export default VitalityDependenciesSummary;

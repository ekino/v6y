'use client';

import * as React from 'react';
import { Suspense } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader';
import VitalitySelectableIndicators from '../../../commons/components/indicators/VitalitySelectableIndicators';
import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityAppsStatsChart from './VitalityAppsStatsChart';

const VitalityAppsStatsView = () => {
    return (
        <>
            <Suspense fallback={<VitalityLoader />}>
                <VitalitySelectableIndicators />
            </Suspense>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityAppsStatsChart />
                <VitalityAppList source="stats" />
            </Suspense>
        </>
    );
};

export default VitalityAppsStatsView;

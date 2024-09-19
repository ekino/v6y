'use client';

import React, { Suspense } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalitySelectableIndicators from '../../../commons/components/indicators/VitalitySelectableIndicators.jsx';
import VitalityAppList from '../../app-list/components/VitalityAppList.jsx';
import VitalityAppsStatsChart from './VitalityAppsStatsChart.jsx';


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

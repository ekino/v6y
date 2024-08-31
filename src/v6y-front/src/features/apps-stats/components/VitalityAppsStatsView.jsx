'use client';

import React, { Suspense } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityKeywords from '../../../commons/components/keywords/VitalityKeywords.jsx';
import VitalityAppList from '../../app-list/components/VitalityAppList.jsx';
import VitalityAppsStatsChart from './VitalityAppsStatsChart.jsx';

const VitalityAppsStatsView = () => {
    return (
        <>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityKeywords />
            </Suspense>
            <Suspense fallback={<VitalityLoader />}>
                <VitalityAppsStatsChart />
                <VitalityAppList source="stats" />
            </Suspense>
        </>
    );
};

export default VitalityAppsStatsView;

'use client';

import React, { Suspense } from 'react';

import VitalityKeywords from '../../../commons/components/VitalityKeywords.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
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

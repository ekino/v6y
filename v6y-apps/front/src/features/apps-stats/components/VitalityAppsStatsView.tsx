'use client';

import { VitalityLoader } from '@v6y/shared-ui';
import * as React from 'react';
import { Suspense } from 'react';

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

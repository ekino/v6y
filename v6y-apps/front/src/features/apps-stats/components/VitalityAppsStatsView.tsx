'use client';

import { LoaderView } from '@v6y/shared-ui';
import * as React from 'react';
import { Suspense } from 'react';

import VitalitySelectableIndicators from '../../../commons/components/indicators/VitalitySelectableIndicators';
import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityAppsStatsChart from './VitalityAppsStatsChart';

const VitalityAppsStatsView = () => {
    return (
        <>
            <Suspense fallback={<LoaderView />}>
                <VitalitySelectableIndicators />
            </Suspense>
            <Suspense fallback={<LoaderView />}>
                <VitalityAppsStatsChart />
                <VitalityAppList source="stats" />
            </Suspense>
        </>
    );
};

export default VitalityAppsStatsView;

'use client';

import { LoaderView } from '@v6y/ui-kit';
import * as React from 'react';
import { Suspense } from 'react';

import VitalitySelectableIndicators from '../../../commons/components/indicators/VitalitySelectableIndicators';
import VitalityAppsStatsChart from './VitalityAppsStatsChart';

const VitalityAppsStatsView = () => {
    return (
        <div className="px-6 py-4 space-y-4">
            <Suspense fallback={<LoaderView />}>
                <VitalitySelectableIndicators />
            </Suspense>
            <Suspense fallback={<LoaderView />}>
                <VitalityAppsStatsChart />
            </Suspense>
        </div>
    );
};

export default VitalityAppsStatsView;

'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityDashboardFilters from './VitalityDashboardFilters';

const VitalityDashboardView = () => {
    return (
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
            <div className="w-full lg:col-span-1 order-first lg:order-none">
                <VitalityDashboardFilters />
            </div>

            <div className="w-full lg:col-span-2">
                <VitalityAppList source="search" />
            </div>
        </div>
    );
};

export default VitalityDashboardView;

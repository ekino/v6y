'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityDashboardFilters from './VitalityDashboardFilters';

const VitalityDashboardView = () => {
    return (
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1">
                <VitalityDashboardFilters />
            </div>
            <div className="col-span-2">
                <VitalityAppList source="search" />
            </div>
        </div>
    );
};

export default VitalityDashboardView;

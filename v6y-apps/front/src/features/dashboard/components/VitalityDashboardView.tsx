'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalityDashboardView = () => {
    return (
        <div className="w-full">
            <VitalityAppList source="search" />
        </div>
    );
};

export default VitalityDashboardView;

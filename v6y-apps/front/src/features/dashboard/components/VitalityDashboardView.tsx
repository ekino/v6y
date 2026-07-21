'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalityDashboardView = () => {
    return (
        <div className="flex w-full flex-col gap-6 lg:gap-8">
            <div className="max-w-3xl space-y-2 px-1">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                    Monitor project health without hunting through reports.
                </h1>
            </div>

            <div className="w-full">
                <VitalityAppList source="search" />
            </div>
        </div>
    );
};

export default VitalityDashboardView;

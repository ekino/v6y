'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityDashboardReportsChart from './VitalityDashboardReportsChart';

const VitalityDashboardView = () => {
    return (
        <div className="mt-2 space-y-4 md:mt-3 md:space-y-5">
            <section className="rounded-2xl border border-slate-200/80 bg-white px-3 py-4 shadow-sm md:px-4 md:py-5">
                <VitalityDashboardReportsChart />
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white px-3 py-4 md:px-4 md:py-5">
                <VitalityAppList source="dashboard" />
            </section>
        </div>
    );
};

export default VitalityDashboardView;

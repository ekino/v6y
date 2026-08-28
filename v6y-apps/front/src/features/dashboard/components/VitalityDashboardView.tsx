'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityDashboardReportsChart from './VitalityDashboardReportsChart';

const VitalityDashboardView = () => {
    return (
        <div className="mt-2 md:mt-3">
            {/* Desktop: Grid layout with chart and projects side by side */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                {/* Chart Section */}
                <section className="rounded-2xl border border-slate-200/60 bg-white px-5 py-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <VitalityDashboardReportsChart />
                </section>

                {/* Projects Section */}
                <section className="rounded-2xl border border-slate-200/60 bg-white px-5 py-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <VitalityAppList source="dashboard" />
                </section>
            </div>

            {/* Mobile/Tablet: Stacked layout */}
            <div className="lg:hidden space-y-4 md:space-y-5">
                <section className="rounded-xl border border-slate-200/80 bg-white px-3 py-4 shadow-sm md:rounded-2xl md:px-5 md:py-6 md:border-slate-200/60 md:shadow-md">
                    <VitalityDashboardReportsChart />
                </section>

                <section className="rounded-xl border border-slate-200/80 bg-white px-3 py-4 shadow-sm md:rounded-2xl md:px-5 md:py-6 md:border-slate-200/60 md:shadow-md">
                    <VitalityAppList source="dashboard" />
                </section>
            </div>
        </div>
    );
};

export default VitalityDashboardView;

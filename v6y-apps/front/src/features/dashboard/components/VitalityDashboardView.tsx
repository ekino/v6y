'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';
import VitalityDashboardReportsChart from './VitalityDashboardReportsChart';

const VitalityDashboardView = () => {
    return (
        <div className="mt-2 space-y-6 md:mt-3">
            {/* Desktop: Grid layout - chart takes 2 cols, projects take 2 cols */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
                {/* Audit Activity Chart - Left Column (spans 2) */}
                <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <VitalityDashboardReportsChart />
                </section>

                {/* Projects Under Watch - Right Column (spans 2) */}
                <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Projects Under Watch
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">Monitor your applications</p>
                    </div>
                    <VitalityAppList source="dashboard" />
                </section>
            </div>

            {/* Mobile/Tablet: Stacked layout */}
            <div className="lg:hidden space-y-6">
                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                    <VitalityDashboardReportsChart />
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Projects Under Watch
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">Monitor your applications</p>
                    </div>
                    <VitalityAppList source="dashboard" />
                </section>
            </div>
        </div>
    );
};

export default VitalityDashboardView;

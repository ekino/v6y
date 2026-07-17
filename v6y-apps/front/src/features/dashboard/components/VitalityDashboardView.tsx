'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalityDashboardView = () => {
    return (
        <div className="mt-4">
            <div className="h-1 w-full rounded-full bg-linear-to-r from-indigo-400 via-fuchsia-400 to-amber-400 animate-gradient-pan mb-3" />
            <section className="rounded-xl border border-slate-200 bg-linear-to-b from-slate-50/70 to-white p-3 md:p-4 shadow-sm">
                <VitalityAppList source="search" />
            </section>
        </div>
    );
};

export default VitalityDashboardView;

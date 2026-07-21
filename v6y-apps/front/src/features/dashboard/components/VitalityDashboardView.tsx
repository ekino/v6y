'use client';

import * as React from 'react';

import VitalityAppList from '../../app-list/components/VitalityAppList';

const VitalityDashboardView = () => {
    return (
        <div className="mt-4">
            <section className="rounded-xl border border-slate-200 bg-linear-to-b from-slate-50/70 to-white p-3 md:p-4 shadow-sm">
                <VitalityAppList source="dashboard" />
            </section>
        </div>
    );
};

export default VitalityDashboardView;

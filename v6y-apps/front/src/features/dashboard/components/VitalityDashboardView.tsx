'use client';

import React, { useState } from 'react';

import {
    CheckCircledIcon,
    DashboardIcon,
    LayersIcon,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityAppList, { DashboardStats } from '../../app-list/components/VitalityAppList';
import VitalityDashboardFilters, { DashboardFilters } from './VitalityDashboardFilters';

const StatCard = ({
    label,
    value,
    sub,
    accent,
    icon,
}: {
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
    icon?: React.ReactNode;
}) => (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200 px-5 py-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
            {icon && <span className="text-slate-400">{icon}</span>}
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                {label}
            </p>
        </div>
        <p className="text-2xl font-bold text-slate-900 leading-none flex items-baseline gap-2">
            {value}
            {accent && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                    {accent}
                </span>
            )}
        </p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
);

const VitalityDashboardView = () => {
    const { translate } = useTranslationProvider();
    const [filters, setFilters] = useState<DashboardFilters>({
        search: '',
        sortOrder: 'asc',
        branchFilter: 'all',
    });
    const [stats, setStats] = useState<DashboardStats>({
        totalCount: 0,
        filteredCount: 0,
        totalBranches: 0,
    });

    return (
        <div className="-mx-4 md:-mx-16 bg-slate-100 px-4 md:px-16 py-6 flex flex-col gap-6">
            {/* KPI stat cards */}
            <div className="flex flex-col sm:flex-row gap-3">
                <StatCard
                    icon={<LayersIcon className="w-4 h-4" />}
                    label={translate('vitality.appListPage.totalLabel') || 'Total Applications'}
                    value={stats.totalCount}
                />
                <StatCard
                    icon={<DashboardIcon className="w-4 h-4" />}
                    label={translate('vitality.appListPage.projectsListTitle') || 'Results'}
                    value={stats.filteredCount}
                    accent={
                        stats.filteredCount < stats.totalCount
                            ? `${stats.filteredCount} / ${stats.totalCount}`
                            : undefined
                    }
                    sub={
                        stats.filteredCount < stats.totalCount
                            ? `filtered from ${stats.totalCount}`
                            : undefined
                    }
                />
                <StatCard
                    icon={<CheckCircledIcon className="w-4 h-4" />}
                    label={translate('vitality.appListPage.nbBranches') || 'Open Branches'}
                    value={stats.totalBranches}
                    sub={
                        translate('vitality.appListPage.infoFeature3Desc') ||
                        'across monitored projects'
                    }
                />
            </div>

            {/* Filters + app list */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                <VitalityDashboardFilters filters={filters} onFiltersChange={setFilters} />
                <div className="flex-1 min-w-0">
                    <VitalityAppList
                        source="search"
                        externalFilters={filters}
                        onStatsChange={setStats}
                    />
                </div>
            </div>
        </div>
    );
};

export default VitalityDashboardView;

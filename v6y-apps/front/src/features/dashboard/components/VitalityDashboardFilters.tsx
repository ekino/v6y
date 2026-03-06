'use client';

import React, { useState } from 'react';

import {
    Badge,
    Button,
    CommitIcon,
    Input,
    Label,
    LightningBoltIcon,
    MagnifyingGlassIcon,
    MixerHorizontalIcon,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityNavigationPaths from '../../../commons/config/VitalityNavigationPaths';

export type BranchFilter = 'all' | 'few' | 'many';
export type SortOrder = 'asc' | 'desc';

export interface DashboardFilters {
    search: string;
    sortOrder: SortOrder;
    branchFilter: BranchFilter;
}

interface VitalityDashboardFiltersProps {
    filters: DashboardFilters;
    onFiltersChange: (filters: DashboardFilters) => void;
}

const QUICK_LINKS: { label: string; desc: string; href: string; color: string; abbr: string }[] = [
    {
        label: 'React',
        desc: 'View all React JS powered applications.',
        href: VitalityNavigationPaths.APP_LIST + '?keywords=react',
        color: 'bg-sky-500',
        abbr: 'Re',
    },
    {
        label: 'Angular',
        desc: 'View all Angular framework applications.',
        href: VitalityNavigationPaths.APP_LIST + '?keywords=angular',
        color: 'bg-rose-500',
        abbr: 'Ng',
    },
    {
        label: 'React Legacy',
        desc: 'View all legacy React applications.',
        href: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-react',
        color: 'bg-amber-500',
        abbr: 'Lg',
    },
    {
        label: 'Angular Legacy',
        desc: 'View all legacy Angular applications.',
        href: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-angular',
        color: 'bg-orange-500',
        abbr: 'La',
    },
    {
        label: 'Health stats',
        desc: 'See health statistics for all apps.',
        href: VitalityNavigationPaths.APPS_STATS,
        color: 'bg-emerald-500',
        abbr: 'Hs',
    },
];

const BRANCH_OPTIONS: { value: BranchFilter; labelKey: string }[] = [
    { value: 'all', labelKey: 'vitality.dashboardPage.filters.branchesAll' },
    { value: 'few', labelKey: 'vitality.dashboardPage.filters.branchesFew' },
    { value: 'many', labelKey: 'vitality.dashboardPage.filters.branchesMany' },
];

const VitalityDashboardFilters = ({ filters, onFiltersChange }: VitalityDashboardFiltersProps) => {
    const { translate } = useTranslationProvider();
    const [mobileOpen, setMobileOpen] = useState(false);

    const update = (partial: Partial<DashboardFilters>) =>
        onFiltersChange({ ...filters, ...partial });

    const hasActiveFilters =
        filters.search !== '' || filters.branchFilter !== 'all' || filters.sortOrder !== 'asc';

    const activeCount = [
        filters.search !== '',
        filters.branchFilter !== 'all',
        filters.sortOrder !== 'asc',
    ].filter(Boolean).length;

    const resetFilters = () =>
        onFiltersChange({ search: '', sortOrder: 'asc', branchFilter: 'all' });

    const content = (
        <div className="flex flex-col gap-5">
            {/* Search */}
            <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    {translate('vitality.dashboardPage.filters.search')}
                </Label>
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Project name…"
                        value={filters.search}
                        onChange={(e) => update({ search: e.target.value })}
                        className="pl-9 h-9 text-sm"
                    />
                </div>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MixerHorizontalIcon className="w-3.5 h-3.5" />
                    {translate('vitality.dashboardPage.filters.sort')}
                </Label>
                <Select
                    value={filters.sortOrder}
                    onValueChange={(v) => update({ sortOrder: v as SortOrder })}
                >
                    <SelectTrigger className="w-full h-9 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">
                            {translate('vitality.dashboardPage.filters.sortAsc')}
                        </SelectItem>
                        <SelectItem value="desc">
                            {translate('vitality.dashboardPage.filters.sortDesc')}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Branch count */}
            <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CommitIcon className="w-3.5 h-3.5" />
                    {translate('vitality.dashboardPage.filters.branches')}
                </Label>
                <div className="flex flex-col gap-0.5">
                    {BRANCH_OPTIONS.map(({ value, labelKey }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => update({ branchFilter: value })}
                            className={[
                                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                                filters.branchFilter === value
                                    ? 'bg-slate-950 text-white font-medium'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                            ].join(' ')}
                        >
                            {translate(labelKey)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Quick access */}
            <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LightningBoltIcon className="w-3.5 h-3.5" />
                    {translate('vitality.dashboardPage.filters.quickAccess')}
                </Label>
                <div className="flex flex-col gap-0.5">
                    {QUICK_LINKS.map(({ label, desc, href, color, abbr }) => (
                        <a
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                            <span
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${color}`}
                            >
                                {abbr}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-800 leading-tight">
                                    {label}
                                </p>
                                <p className="text-[11px] text-slate-400 leading-tight truncate">
                                    {desc}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
                <Button variant="outline" className="w-full h-9 text-sm" onClick={resetFilters}>
                    {translate('vitality.dashboardPage.filters.reset')}
                </Button>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile: toggle button + collapsible panel */}
            <div className="md:hidden">
                <Button
                    variant="outline"
                    type="button"
                    className="flex items-center gap-2 h-9 text-sm"
                    onClick={() => setMobileOpen((o) => !o)}
                >
                    <MixerHorizontalIcon className="w-4 h-4" />
                    {translate('vitality.dashboardPage.filters.title')}
                    {hasActiveFilters && (
                        <Badge className="h-5 px-1.5 text-xs rounded-full">{activeCount}</Badge>
                    )}
                </Button>
                {mobileOpen && (
                    <div className="mt-3 bg-white border border-slate-200 rounded-xl p-5 shadow-md">
                        {content}
                    </div>
                )}
            </div>

            {/* Desktop: sticky sidebar */}
            <aside className="hidden md:block w-52 lg:w-60 flex-shrink-0 self-start">
                <div className="sticky top-6 bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                    {content}
                </div>
            </aside>
        </>
    );
};

export default VitalityDashboardFilters;

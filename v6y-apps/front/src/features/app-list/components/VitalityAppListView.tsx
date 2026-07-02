'use client';

import { useMemo, useState } from 'react';

import { DynamicLoader } from '@v6y/ui-kit';
import {
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Clipboard,
    FileText,
    Input,
    MixerHorizontalIcon,
    ShuffleIcon,
    TypographyH3,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import { VitalityAppGlobalFilters } from '../types/VitalityAppGlobalFilters';

const VitalityAppList = DynamicLoader(() => import('./VitalityAppList'));

const VitalityAppListView = () => {
    const { translate } = useTranslationProvider();
    const [filters, setFilters] = useState<VitalityAppGlobalFilters>({});

    const getCopy = (key: string, fallback: string) => {
        const value = translate(key);
        return value && value !== key ? value : fallback;
    };

    const updateNumberFilter = (
        key: 'minReports' | 'maxReports' | 'minBranches' | 'maxBranches',
        value: string,
    ) => {
        const trimmed = value.trim();
        setFilters((prev) => ({
            ...prev,
            [key]: trimmed === '' ? undefined : Number.parseInt(trimmed, 10),
        }));
    };

    const updateDateFilter = (key: 'createdFrom' | 'createdTo', value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const resetFilters = () => {
        setFilters({});
    };

    const activeFiltersCount = useMemo(
        () => Object.values(filters).filter((value) => value !== undefined && value !== '').length,
        [filters],
    );

    const selectedCountTemplate = getCopy(
        'vitality.appListPage.globalFilters.selectedCount',
        '{count} selected',
    );
    const selectedCountText = selectedCountTemplate.includes('{count}')
        ? selectedCountTemplate.replace('{count}', `${activeFiltersCount}`)
        : `${activeFiltersCount} ${selectedCountTemplate}`;

    return (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-4">
                <Card className="border-gray-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white">
                                <MixerHorizontalIcon className="w-4 h-4" />
                            </span>
                            <span>
                                {getCopy(
                                    'vitality.appListPage.globalFilters.title',
                                    'Global Filters',
                                )}
                            </span>
                        </CardTitle>
                        <CardDescription>
                            {getCopy(
                                'vitality.appListPage.globalFilters.description',
                                'Filter applications by reports volume, creation period and number of branches',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="global-filter-min-reports"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    {getCopy(
                                        'vitality.appListPage.globalFilters.minReportsLabel',
                                        'Min reports',
                                    )}
                                </label>
                                <Input
                                    id="global-filter-min-reports"
                                    type="number"
                                    min={0}
                                    placeholder={getCopy(
                                        'vitality.appListPage.globalFilters.minReportsPlaceholder',
                                        '0',
                                    )}
                                    value={filters.minReports ?? ''}
                                    onChange={(e) =>
                                        updateNumberFilter('minReports', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="global-filter-max-reports"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    {getCopy(
                                        'vitality.appListPage.globalFilters.maxReportsLabel',
                                        'Max reports',
                                    )}
                                </label>
                                <Input
                                    id="global-filter-max-reports"
                                    type="number"
                                    min={0}
                                    placeholder={getCopy(
                                        'vitality.appListPage.globalFilters.maxReportsPlaceholder',
                                        '500',
                                    )}
                                    value={filters.maxReports ?? ''}
                                    onChange={(e) =>
                                        updateNumberFilter('maxReports', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="global-filter-min-branches"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    {getCopy(
                                        'vitality.appListPage.globalFilters.minBranchesLabel',
                                        'Min branches',
                                    )}
                                </label>
                                <Input
                                    id="global-filter-min-branches"
                                    type="number"
                                    min={0}
                                    placeholder={getCopy(
                                        'vitality.appListPage.globalFilters.minBranchesPlaceholder',
                                        '1',
                                    )}
                                    value={filters.minBranches ?? ''}
                                    onChange={(e) =>
                                        updateNumberFilter('minBranches', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="global-filter-max-branches"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    {getCopy(
                                        'vitality.appListPage.globalFilters.maxBranchesLabel',
                                        'Max branches',
                                    )}
                                </label>
                                <Input
                                    id="global-filter-max-branches"
                                    type="number"
                                    min={0}
                                    placeholder={getCopy(
                                        'vitality.appListPage.globalFilters.maxBranchesPlaceholder',
                                        '30',
                                    )}
                                    value={filters.maxBranches ?? ''}
                                    onChange={(e) =>
                                        updateNumberFilter('maxBranches', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="global-filter-created-from"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    {getCopy(
                                        'vitality.appListPage.globalFilters.createdFromLabel',
                                        'Created from',
                                    )}
                                </label>
                                <Input
                                    id="global-filter-created-from"
                                    type="date"
                                    value={filters.createdFrom ?? ''}
                                    onChange={(e) =>
                                        updateDateFilter('createdFrom', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="global-filter-created-to"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    {getCopy(
                                        'vitality.appListPage.globalFilters.createdToLabel',
                                        'Created to',
                                    )}
                                </label>
                                <Input
                                    id="global-filter-created-to"
                                    type="date"
                                    value={filters.createdTo ?? ''}
                                    onChange={(e) => updateDateFilter('createdTo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                                {getCopy(
                                    'vitality.appListPage.globalFilters.highlightsTitle',
                                    'Quick focus',
                                )}
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                    <Clipboard className="w-4 h-4 text-slate-500" />
                                    <span>
                                        {getCopy(
                                            'vitality.appListPage.globalFilters.highlightsReports',
                                            'Find apps with many audit reports',
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                    <ShuffleIcon className="w-4 h-4 text-slate-500" />
                                    <span>
                                        {getCopy(
                                            'vitality.appListPage.globalFilters.highlightsBranches',
                                            'Target monorepos with lots of branches',
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                    <FileText className="w-4 h-4 text-slate-500" />
                                    <span>
                                        {getCopy(
                                            'vitality.appListPage.globalFilters.highlightsDate',
                                            'Focus on recently created apps',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {activeFiltersCount > 0 && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2"
                                >
                                    {getCopy(
                                        'vitality.dashboardPage.filters.reset',
                                        'Reset Filters',
                                    )}
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {activeFiltersCount > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                            <TypographyH3 className="text-md">
                                {getCopy(
                                    'vitality.appListPage.activeFiltersLabel',
                                    'Active Filters',
                                )}
                            </TypographyH3>
                            <Badge variant="default" className="text-xs">
                                {selectedCountText}
                            </Badge>
                        </div>
                    </div>
                )}
            </aside>

            <section className="lg:col-span-8 xl:col-span-9">
                <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/70 to-white p-3 md:p-4 shadow-sm">
                    <VitalityAppList filters={filters} />
                </div>
            </section>
        </div>
    );
};

export default VitalityAppListView;

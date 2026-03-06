'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import {
    Button,
    Card,
    CardContent,
    InfoCircledIcon,
    Spinner,
    useTranslationProvider,
} from '@v6y/ui-kit-front';

import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { formatApplicationDataSource } from '../../../commons/config/VitalityCommonConfig';
import { exportAppListDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useInfiniteClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import { DashboardFilters } from '../../dashboard/components/VitalityDashboardFilters';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';
import VitalityAppListHeader from './VitalityAppListHeader';
import VitalityAppListInfo from './VitalityAppListInfo';
import VitalityAppListPagination from './VitalityAppListPagination';

export interface DashboardStats {
    totalCount: number;
    filteredCount: number;
    totalBranches: number;
}

const initialPage = 0;

interface VitalityAppListQueryType {
    isLoading: boolean;
    data?: {
        pages?: unknown[];
    };
    fetchNextPage?: () => void;
    status?: string;
    isFetchingNextPage?: boolean;
    isFetching?: boolean;
}

interface ApplicationListPage {
    totalCount: number;
    getApplicationListByPageAndParams: ApplicationType[];
}

const VitalityAppList: React.FC<{
    source?: string;
    externalFilters?: DashboardFilters;
    onStatsChange?: (stats: DashboardStats) => void;
}> = ({ source, externalFilters, onStatsChange }) => {
    const [appList, setAppList] = useState<ApplicationType[] | undefined>(undefined);
    const [searchInput, setSearchInput] = useState<string>('');
    const currentAppListPage = useRef<number>(initialPage);

    const {
        data: dataAppList,
        fetchNextPage: fetchAppListNextPage,
        status: appListFetchStatus,
        isFetchingNextPage: isAppListFetchingNextPage,
        isFetching: isAppListFetching,
    }: VitalityAppListQueryType = useInfiniteClientQuery({
        queryCacheKey: [
            'getApplicationListByPageAndParams',
            'all_apps',
            `${currentAppListPage.current}`,
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
                query: GetApplicationListByPageAndParams,
                variables: {
                    offset: currentAppListPage.current * VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
                    limit: VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
                    keywords: undefined,
                    searchText: undefined,
                },
            }),
        getNextPageParam: () => currentAppListPage.current,
    });

    const totalCount = (dataAppList?.pages?.[0] as ApplicationListPage)?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / VitalityApiConfig.VITALITY_BFF_PAGE_SIZE);

    useEffect(() => {
        setAppList(
            formatApplicationDataSource(
                (dataAppList?.pages as {
                    getApplicationListByPageAndParams: ApplicationType;
                }[]) || [],
            ),
        );
    }, [dataAppList?.pages]);

    useEffect(() => {
        currentAppListPage.current = 0;
        fetchAppListNextPage?.();
    }, [fetchAppListNextPage]);

    const isAppListLoading =
        appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

    const effectiveSearch = externalFilters?.search ?? searchInput;

    const filteredAppList = useMemo(() => {
        let list = (appList ?? []).filter(
            (app) =>
                effectiveSearch.trim() === '' ||
                (app.name ?? '').toLowerCase().includes(effectiveSearch.toLowerCase()),
        );

        if (externalFilters?.branchFilter && externalFilters.branchFilter !== 'all') {
            const branchFilter = externalFilters.branchFilter;
            list = list.filter((app) => {
                const count =
                    (app.repo as { allBranches?: unknown[] } | undefined)?.allBranches?.length ?? 0;
                return branchFilter === 'few' ? count < 5 : count >= 5;
            });
        }

        if (externalFilters?.sortOrder) {
            list = [...list].sort((a, b) =>
                externalFilters.sortOrder === 'asc'
                    ? (a.name ?? '').localeCompare(b.name ?? '')
                    : (b.name ?? '').localeCompare(a.name ?? ''),
            );
        }

        return list;
    }, [appList, effectiveSearch, externalFilters]);

    useEffect(() => {
        if (!onStatsChange) return;
        const totalBranches = (filteredAppList ?? []).reduce(
            (sum, app) =>
                sum +
                ((app.repo as { allBranches?: unknown[] } | undefined)?.allBranches?.length ?? 0),
            0,
        );
        onStatsChange({
            totalCount: appList?.length ?? 0,
            filteredCount: filteredAppList?.length ?? 0,
            totalBranches,
        });
    }, [appList, filteredAppList, onStatsChange]);

    const onExportApplicationsClicked = () => {
        exportAppListDataToCSV(appList || []);
    };

    const onPageChange = (page: number) => {
        currentAppListPage.current = page - 1;
        setAppList(undefined);
        fetchAppListNextPage?.();
    };

    const { translate } = useTranslationProvider();

    return (
        <div className="w-full flex flex-col gap-4">
            {!externalFilters && (
                <div className="w-full flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-300"></div>
                    <h1 className="text-base sm:text-2xl font-semibold text-slate-950 whitespace-nowrap">
                        {translate('vitality.dashboardPage.shortTitle').toUpperCase()}
                    </h1>
                    <div className="flex-1 h-px bg-slate-300"></div>
                </div>
            )}

            {!externalFilters && <VitalityAppListInfo />}

            <VitalityAppListHeader
                onExportApplicationsClicked={onExportApplicationsClicked}
                searchValue={externalFilters ? undefined : searchInput}
                onSearchChange={externalFilters ? undefined : setSearchInput}
                showSearch={!externalFilters}
                appsCount={filteredAppList?.length || 0}
            />

            {isAppListLoading && !appList ? (
                <div className="py-20">
                    <Spinner />
                </div>
            ) : Array.isArray(filteredAppList) && filteredAppList.length === 0 ? (
                <div className="w-full max-w-6xl px-4 py-20 text-center text-zinc-500">
                    {translate('vitality.appListPage.empty')}
                </div>
            ) : (
                <div className="w-full">
                    {filteredAppList && (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredAppList.map((app) => (
                                <VitalityAppInfos key={app._id} app={app} source={source} />
                            ))}

                            <Card className="w-full border border-dashed border-slate-200 bg-white shadow-none">
                                <CardContent className="flex flex-col items-center justify-center text-center p-6 gap-3">
                                    <InfoCircledIcon className="w-6 h-6 text-slate-300" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">
                                            {translate('vitality.appListPage.addProjectTitle')}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                            {translate(
                                                'vitality.appListPage.addProjectDescription',
                                            )}
                                        </p>
                                    </div>
                                    <a
                                        href={process.env.NEXT_PUBLIC_BACK_OFFICE_URL || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button size="sm" variant="outline">
                                            {translate('vitality.appListPage.goToBackOffice')}
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {filteredAppList && (
                        <div className="mt-12">
                            <VitalityAppListPagination
                                currentPage={currentAppListPage.current + 1}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VitalityAppList;

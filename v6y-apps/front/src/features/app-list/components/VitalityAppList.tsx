'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { InfoCircledIcon, Spinner, useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { formatApplicationDataSource } from '../../../commons/config/VitalityCommonConfig';
import { exportAppListDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useInfiniteClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';
import VitalityAppListHeader from './VitalityAppListHeader';
import VitalityAppListInfo from './VitalityAppListInfo';
import VitalityAppListPagination from './VitalityAppListPagination';

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

const VitalityAppList: React.FC<{ source?: string }> = ({ source }) => {
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
    const filteredAppList = appList?.filter(
        (app) =>
            searchInput.trim() === '' || app.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

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
        <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-300"></div>
                <h1 className="text-base sm:text-2xl font-semibold text-slate-950 whitespace-nowrap">
                    {translate('vitality.dashboardPage.shortTitle').toUpperCase()}
                </h1>
                <div className="flex-1 h-px bg-slate-300"></div>
            </div>

            <VitalityAppListInfo />

            <VitalityAppListHeader
                onExportApplicationsClicked={onExportApplicationsClicked}
                searchValue={searchInput}
                onSearchChange={setSearchInput}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {filteredAppList.map((app) => (
                                <VitalityAppInfos key={app._id} app={app} source={source} />
                            ))}

                            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-10 shadow-md hover:shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300">
                                <div className="space-y-5">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
                                        <InfoCircledIcon className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="text-slate-950 font-bold text-lg">
                                            {translate('vitality.appListPage.addProjectTitle')}
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed max-w-sm mt-2">
                                            {translate(
                                                'vitality.appListPage.addProjectDescription',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
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

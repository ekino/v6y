'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { Spinner, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit-front';

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
    const currentAppListPage = useRef<number>(initialPage);

    const { getUrlParams } = useNavigationAdapter();
    const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

    const {
        data: dataAppList,
        fetchNextPage: fetchAppListNextPage,
        status: appListFetchStatus,
        isFetchingNextPage: isAppListFetchingNextPage,
        isFetching: isAppListFetching,
    }: VitalityAppListQueryType = useInfiniteClientQuery({
        queryCacheKey: [
            'getApplicationListByPageAndParams',
            keywords?.length ? keywords : 'empty_keywords',
            searchText?.length ? searchText : 'empty_search_text',
            `${currentAppListPage.current}`,
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
                query: GetApplicationListByPageAndParams,
                variables: {
                    offset: currentAppListPage.current * VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
                    limit: VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
                    keywords,
                    searchText,
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
    }, [keywords, searchText, fetchAppListNextPage]);

    const isAppListLoading =
        appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

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
            <VitalityAppListHeader onExportApplicationsClicked={onExportApplicationsClicked} />

            <VitalityAppListInfo />

            {isAppListLoading && !appList ? (
                <div className="py-20">
                    <Spinner />
                </div>
            ) : Array.isArray(appList) && appList.length === 0 ? (
                <div className="w-full max-w-6xl px-4 py-20 text-center text-zinc-500">
                    {translate('vitality.appListPage.empty')}
                </div>
            ) : (
                <div className="w-full">
                    {appList && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {appList.map((app) => (
                                <VitalityAppInfos key={app._id} app={app} source={source} />
                            ))}

                            <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-md flex flex-col items-center justify-center min-h-[420px] text-center">
                                <div className="space-y-4">
                                    <div className="text-zinc-900 font-bold text-lg">
                                        {translate('vitality.appListPage.addProjectTitle')}
                                    </div>
                                    <p className="text-zinc-600 text-sm leading-relaxed">
                                        {translate('vitality.appListPage.addProjectDescription')}
                                    </p>
                                    <a
                                        href={VitalityApiConfig.VITALITY_BACK_OFFICE_URL || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-2 rounded-md transition-colors text-sm font-medium"
                                    >
                                        {translate('vitality.appListPage.goToBackOffice')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {appList && (
                        <div className="mt-8">
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

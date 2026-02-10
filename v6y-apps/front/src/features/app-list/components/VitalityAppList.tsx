'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import { Spinner } from '@v6y/ui-kit-front/components/atoms/spinner';
import { useNavigationAdapter } from '@v6y/ui-kit-front/hooks/useNavigationAdapter';
import { useTranslationProvider } from '@v6y/ui-kit-front/translation/useTranslationProvider';

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

            {isAppListLoading && !appList ? (
                <div className="py-20">
                    <Spinner />
                </div>
            ) : Array.isArray(appList) && appList.length === 0 ? (
                <div className="w-full max-w-4xl px-4 py-20 text-center text-zinc-500">
                    {translate('vitality.appListPage.empty')}
                </div>
            ) : (
                <div className="w-full">
                    {appList && (
                        <ul className="gap-4">
                            {appList.map((app) => (
                                <VitalityAppInfos key={app._id} app={app} source={source} />
                            ))}
                        </ul>
                    )}

                    {appList && (
                        <VitalityAppListPagination
                            currentPage={currentAppListPage.current + 1}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default VitalityAppList;

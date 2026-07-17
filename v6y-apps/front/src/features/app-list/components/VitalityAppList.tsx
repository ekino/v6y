'use client';

import React, { useEffect, useState } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { Spinner, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit-front';

import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';
import VitalityAppListHeader from './VitalityAppListHeader';
import VitalityAppListPagination from './VitalityAppListPagination';

const APP_LIST_MAX_ITEMS = 1000;

const VitalityAppList: React.FC<{ source?: string }> = ({ source }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { translate } = useTranslationProvider();
    const { getUrlParams } = useNavigationAdapter();
    const [, searchText] = getUrlParams(['keywords', 'searchText']);

    const { data: dataAppList, isLoading: isAppListLoading } = useClientQuery<{
        getApplicationListByPageAndParams: ApplicationType[];
    }>({
        queryCacheKey: [
            'getApplicationListByPageAndParams',
            searchText?.length ? searchText : 'empty_search_text',
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
                query: GetApplicationListByPageAndParams,
                variables: {
                    offset: 0,
                    limit: APP_LIST_MAX_ITEMS,
                    searchText,
                },
            }),
    });

    const appList = dataAppList?.getApplicationListByPageAndParams || [];
    const totalCount = appList.length;
    const pageSize = VitalityApiConfig.VITALITY_BFF_PAGE_SIZE;
    const totalPages = Math.ceil(totalCount / pageSize);
    const pageStart = (currentPage - 1) * pageSize;
    const paginatedAppList = appList.slice(pageStart, pageStart + pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchText]);

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <VitalityAppListHeader
                appsTotal={totalCount}
                addApplicationUrl={VitalityApiConfig.VITALITY_FRONT_BO_URL}
            />

            {isAppListLoading && !dataAppList ? (
                <div className="py-20">
                    <Spinner />
                </div>
            ) : appList.length === 0 ? (
                <div className="w-full max-w-4xl px-4 py-20 text-center text-zinc-500">
                    {translate('vitality.appListPage.empty')}
                </div>
            ) : (
                <div className="w-full">
                    <ul className="space-y-4">
                        {paginatedAppList.map((app) => (
                            <VitalityAppInfos key={app._id} app={app} source={source} />
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <VitalityAppListPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default VitalityAppList;

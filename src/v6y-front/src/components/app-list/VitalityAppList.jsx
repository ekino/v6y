'use client';

import React, { useEffect, useState } from 'react';
import {
    buildGraphqlQuery,
    useGraphqlClient,
    useInfiniteGraphqlClient,
} from '../../commons/services/useGraphqlClient.jsx';
import { GET_APP_KEYWORDS, GET_APP_LIST_PAGINATED } from '../../services';
import VitalityConfig from '../../commons/config/VitalityConfig.js';
import useUrlParams from '../../commons/navigation/useUrlParams.jsx';
import VitalityInfiniteList from '../../commons/components/VitalityInfiniteList.jsx';
import VitalityPageLayout from '../../commons/components/VitalityPageLayout.jsx';
import VitalitySearchBar from '../../commons/components/VitalitySearchBar.jsx';
import VitalityKeywords from '../../commons/components/keywords/VitalityKeywords.jsx';
import VitalityAppListItem from './VitalityAppListItem.jsx';
import CommonsDico from '../../commons/dico/CommonsDico.js';

let currentAppListPage = 0;

const VitalityAppList = () => {
    const [appList, setAppList] = useState([]);
    const { getUrlParams } = useUrlParams();
    const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

    const { loading: isKeywordsLoading, data: dataKeywords } = useGraphqlClient({
        queryKey: ['getKeywords'],
        queryFn: async () =>
            buildGraphqlQuery({
                query: GET_APP_KEYWORDS,
                queryParams: {},
            }),
    });

    const {
        data: dataAppList,
        fetchNextPage: fetchAppListNextPage,
        status: appListFetchStatus,
        isFetchingNextPage: isAppListFetchingNextPage,
        isFetching: isAppListFetching,
    } = useInfiniteGraphqlClient({
        queryKey: [
            'getAppListByPageAndParams',
            keywords?.length ? keywords : 'empty_keywords',
            searchText?.length ? searchText : 'empty_search_text',
        ],
        queryFn: async ({ pageParam = 0 }) =>
            buildGraphqlQuery({
                query: GET_APP_LIST_PAGINATED,
                queryParams: {
                    offset: pageParam,
                    limit: VitalityConfig.VITALITY_BFF_PAGE_SIZE,
                    keywords,
                    searchText,
                },
            }),
        getNextPageParam: () => currentAppListPage,
    });

    useEffect(() => {
        const pagedAppList = dataAppList?.pages;
        const mergedAppList = pagedAppList
            ?.map((page) => {
                return page?.getAppListByPageAndParams;
            })
            ?.flat();
        setAppList(mergedAppList);
    }, [dataAppList?.pages]);

    const isAppListLoading =
        appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

    const isAppListEmpty = !isAppListLoading && !dataAppList?.pages?.length;

    const showKeywords = !isKeywordsLoading && dataKeywords?.getAppKeywords?.length > 0;

    const onSearchChanged = (value) => {
        console.log(value);
    };

    const onSelectedKeyword = (keywords) => {
        console.log(keywords);
    };

    const onLoadMore = () => {
        currentAppListPage = appList?.length ? appList?.length : 0;
        fetchAppListNextPage();
    };

    if (isAppListEmpty) {
        return <>Empty</>;
    }

    return (
        <VitalityPageLayout pageTitle={CommonsDico.VITALITY_APP_LIST_PAGE_TITLE}>
            <VitalitySearchBar
                placeholder={CommonsDico.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                helper={CommonsDico.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                onSearchChanged={onSearchChanged}
            />
            {showKeywords && (
                <VitalityKeywords
                    keywords={dataKeywords?.getAppKeywords}
                    onSelectedKeyword={onSelectedKeyword}
                />
            )}
            <VitalityInfiniteList
                isDataSourceLoading={isAppListLoading}
                dataSource={appList}
                renderItem={(app) => <VitalityAppListItem app={app} />}
                onLoadMore={onLoadMore}
            />
        </VitalityPageLayout>
    );
};

export default VitalityAppList;

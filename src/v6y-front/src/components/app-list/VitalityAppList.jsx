'use client';

import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import {
    buildGraphqlQuery,
    useGraphqlClient,
    useInfiniteGraphqlClient,
} from '../../commons/services/useGraphqlClient.jsx';
import { GET_APP_KEYWORDS, GET_APP_LIST_PAGINATED } from '../../services';
import VitalityConfig from '../../commons/config/VitalityConfig.js';
import CommonsDico from '../../commons/dico/CommonsDico.js';
import useUrlParams from '../../commons/navigation/useUrlParams.jsx';
import VitalityLoadMoreList from '../../commons/components/VitalityLoadMoreList.jsx';
import VitalityPageLayout from '../../commons/components/VitalityPageLayout.jsx';
import VitalitySearchBar from '../../commons/components/VitalitySearchBar.jsx';
import VitalityKeywords from '../../commons/components/keywords/VitalityKeywords.jsx';
import VitalityAppListItem from './VitalityAppListItem.jsx';

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

    return (
        <VitalityPageLayout pageTitle={CommonsDico.VITALITY_APP_LIST_PAGE_TITLE}>
            <Row justify="center" align="middle" gutter={[0, 24]}>
                <Col span={24}>
                    <VitalitySearchBar
                        placeholder={CommonsDico.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                        helper={CommonsDico.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                        onSearchChanged={onSearchChanged}
                    />
                </Col>
                {showKeywords && (
                    <Col span={20}>
                        <VitalityKeywords
                            keywords={dataKeywords?.getAppKeywords}
                            onSelectedKeyword={onSelectedKeyword}
                        />
                    </Col>
                )}
                <Col span={20}>
                    <VitalityLoadMoreList
                        isDataSourceLoading={isAppListLoading}
                        dataSource={appList}
                        renderItem={(app) => <VitalityAppListItem app={app} />}
                        onLoadMore={onLoadMore}
                    />
                </Col>
            </Row>
        </VitalityPageLayout>
    );
};

export default VitalityAppList;

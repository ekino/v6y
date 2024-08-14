'use client';

import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import VitalityLoadMoreList from '../../../commons/components/VitalityLoadMoreList.jsx';
import VitalitySearchBar from '../../../commons/components/VitalitySearchBar.jsx';
import VitalityKeywords from '../../../commons/components/keywords/VitalityKeywords.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import { exportAppListDataToCSV } from '../../../commons/utils/VitalityDataExportUtils.js';
import {
    buildClientQuery,
    useClientQuery,
    useInfiniteClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppKeywords from '../api/getAppKeywords.js';
import GetAppListByPageAndParams from '../api/getAppListByPageAndParams.js';
import GetAppsTotalByParams from '../api/getAppsTotalByParams.js';
import VitalityAppListHeader from './VitalityAppListHeader.jsx';
import VitalityAppListItem from './VitalityAppListItem.jsx';

let currentAppListPage = 0;

const VitalityAppList = () => {
    const [appList, setAppList] = useState([]);
    const [appsTotal, setAppsTotal] = useState(0);

    const { getUrlParams } = useNavigationAdapter();
    const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

    const { isLoading: isKeywordsLoading, data: dataKeywords } = useClientQuery({
        queryCacheKey: ['getKeywords'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppKeywords,
                queryParams: {},
            }),
    });

    const { data: dataAppsTotal, refetch: refetchAppsTotal } = useClientQuery({
        queryCacheKey: [
            'getAppsTotalByParams',
            keywords?.length ? keywords : 'empty_keywords',
            searchText?.length ? searchText : 'empty_search_text',
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppsTotalByParams,
                queryParams: {
                    keywords,
                    searchText,
                },
            }),
    });

    const {
        data: dataAppList,
        fetchNextPage: fetchAppListNextPage,
        status: appListFetchStatus,
        isFetchingNextPage: isAppListFetchingNextPage,
        isFetching: isAppListFetching,
    } = useInfiniteClientQuery({
        queryCacheKey: [
            'getAppListByPageAndParams',
            keywords?.length ? keywords : 'empty_keywords',
            searchText?.length ? searchText : 'empty_search_text',
        ],
        queryBuilder: async ({ pageParam = 0 }) =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppListByPageAndParams,
                queryParams: {
                    offset: pageParam,
                    limit: VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
                    keywords,
                    searchText,
                },
            }),
        nextPageParamBuilder: () => currentAppListPage,
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

    useEffect(() => {
        setAppsTotal(dataAppsTotal?.getAppsTotalByParams);
    }, [dataAppsTotal?.getAppsTotalByParams]);

    useEffect(() => {
        setAppsTotal(0);
        refetchAppsTotal?.();

        currentAppListPage = 0;
        fetchAppListNextPage?.();
    }, [keywords, searchText]);

    const isAppListLoading =
        appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

    const showKeywords = !isKeywordsLoading && dataKeywords?.getAppKeywords?.length > 0;

    const onSearchChanged = (value) => {
        console.log(value);
    };

    const onKeywordsChanged = (keywords) => {
        console.log(keywords);
    };

    const onExportApplicationsClicked = () => {
        exportAppListDataToCSV({ appList });
    };

    const onLoadMore = () => {
        currentAppListPage = appList?.length ? appList?.length : 0;
        fetchAppListNextPage();
    };

    return (
        <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24}>
                <VitalitySearchBar
                    placeholder={VitalityTerms.VITALITY_SEARCHBAR_INPUT_PLACEHOLDER}
                    helper={VitalityTerms.VITALITY_GLOBAL_SEARCHBAR_INPUT_HELPER}
                    label={VitalityTerms.VITALITY_SEARCHBAR_INPUT_LABEL}
                    onSearchChanged={onSearchChanged}
                />
            </Col>
            {showKeywords && (
                <Col span={20}>
                    <VitalityKeywords
                        keywords={dataKeywords?.getAppKeywords}
                        onKeywordsChanged={onKeywordsChanged}
                    />
                </Col>
            )}
            <Col span={20}>
                <VitalityAppListHeader
                    appsTotal={appsTotal}
                    onExportApplicationsClicked={onExportApplicationsClicked}
                />
            </Col>
            <Col span={20}>
                <VitalityLoadMoreList
                    isDataSourceLoading={isAppListLoading}
                    dataSource={appList}
                    renderItem={(app) => <VitalityAppListItem app={app} />}
                    onLoadMore={onLoadMore}
                />
            </Col>
        </Row>
    );
};

export default VitalityAppList;

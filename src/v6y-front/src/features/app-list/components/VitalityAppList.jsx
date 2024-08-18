'use client';

import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import VitalityLoadMoreList from '../../../commons/components/VitalityLoadMoreList.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import { exportAppListDataToCSV } from '../../../commons/utils/VitalityDataExportUtils.js';
import {
    buildClientQuery,
    useInfiniteClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppListByPageAndParams from '../api/getAppListByPageAndParams.js';
import VitalityAppListHeader from './VitalityAppListHeader.jsx';
import VitalityAppListItem from './VitalityAppListItem.jsx';

let currentAppListPage = 0;

const VitalityAppList = ({ source }) => {
    const [appList, setAppList] = useState([]);

    const { getUrlParams } = useNavigationAdapter();
    const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

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
        currentAppListPage = 0;
        fetchAppListNextPage?.();
    }, [keywords, searchText]);

    const isAppListLoading =
        appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

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
                <VitalityAppListHeader onExportApplicationsClicked={onExportApplicationsClicked} />
            </Col>
            <Col span={24}>
                <VitalityLoadMoreList
                    isDataSourceLoading={isAppListLoading}
                    dataSource={appList}
                    renderItem={(app) => <VitalityAppListItem app={app} source={source} />}
                    onLoadMore={onLoadMore}
                />
            </Col>
        </Row>
    );
};

export default VitalityAppList;

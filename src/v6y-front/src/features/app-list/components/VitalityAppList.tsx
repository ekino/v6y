'use client';

import { formatApplicationDataSource } from '@/commons/config/VitalityCommonConfig';
import { exportAppListDataToCSV } from '@/commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useInfiniteClientQuery,
} from '@/infrastructure/adapters/api/useQueryAdapter';
import { ApplicationType } from '@v6y/commons';
import { Col, Row } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityLoadMoreList from '../../../commons/components/VitalityLoadMoreList';
import VitalityDynamicLoader from '../../../commons/components/VitalityDynamicLoader';
import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';

const VitalityAppListHeader = VitalityDynamicLoader(() => import('./VitalityAppListHeader'));

let currentAppListPage = 0;

interface VitalityAppListQueryType {
    isLoading: boolean;
    data?: { pages: Array<{ getApplicationListByPageAndParams: ApplicationType }> };
    fetchNextPage: () => void;
    status: string;
    isFetchingNextPage: boolean;
    isFetching: boolean;
    pageParam?: number;
}

const VitalityAppList = ({ source }: { source?: string }) => {
    const [appList, setAppList] = useState<ApplicationType[]>();

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
            `${currentAppListPage}`,
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationListByPageAndParams,
                variables: {
                    offset: 0,
                    limit: VitalityApiConfig.VITALITY_BFF_PAGE_SIZE,
                    keywords,
                    searchText,
                },
            }),
        getNextPageParam: () => currentAppListPage,
    });

    useEffect(() => {
        setAppList(formatApplicationDataSource(dataAppList?.pages || []));
    }, [dataAppList?.pages]);

    useEffect(() => {
        currentAppListPage = 0;
        fetchAppListNextPage?.();
    }, [keywords, searchText, fetchAppListNextPage]);

    const isAppListLoading =
        appListFetchStatus === 'loading' || isAppListFetching || isAppListFetchingNextPage || false;

    const onExportApplicationsClicked = () => {
        exportAppListDataToCSV(appList || []);
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
            <Col span={20}>
                <VitalityLoadMoreList
                    isDataSourceLoading={isAppListLoading}
                    dataSource={appList || []}
                    renderItem={(item: unknown) => {
                        const app = item as ApplicationType;
                        return <VitalityAppInfos key={app._id} app={app} source={source} />;
                    }}
                    onLoadMore={onLoadMore}
                />
            </Col>
        </Row>
    );
};

export default VitalityAppList;

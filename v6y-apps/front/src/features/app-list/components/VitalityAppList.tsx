'use client';

import { ApplicationType } from '@v6y/core-logic/src/types';
import {
    Col,
    DynamicLoader,
    EmptyView,
    LoadMoreList,
    Row,
    useNavigationAdapter,
} from '@v6y/shared-ui';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityAppInfos from '../../../commons/components/application-info/VitalityAppInfos';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import { formatApplicationDataSource } from '../../../commons/config/VitalityCommonConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import { exportAppListDataToCSV } from '../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useInfiniteClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationListByPageAndParams from '../api/getApplicationListByPageAndParams';

const VitalityAppListHeader = DynamicLoader(() => import('./VitalityAppListHeader'));

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
            {appList?.length === 0 ? (
                <EmptyView />
            ) : (
                <Col span={20}>
                    <LoadMoreList
                        isDataSourceLoading={isAppListLoading}
                        loadMoreLabel={VitalityTerms.VITALITY_APP_LIST_LOAD_MORE_LABEL}
                        dataSource={appList || []}
                        renderItem={(item: unknown) => {
                            const app = item as ApplicationType;
                            return <VitalityAppInfos key={app._id} app={app} source={source} />;
                        }}
                        onLoadMore={onLoadMore}
                    />
                </Col>
            )}
        </Row>
    );
};

export default VitalityAppList;

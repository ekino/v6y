import { AgCharts } from 'ag-charts-react';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';

import VitalityEmptyView from '../../../commons/components/VitalityEmptyView.jsx';
import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetAppsStatsByParams from '../api/getAppsStatsByParams.js';


const VitalityAppsStatsChart = () => {
    const { getUrlParams } = useNavigationAdapter();
    const [keywords] = getUrlParams(['keywords']);

    const {
        isLoading: appsStatsLoading,
        data: dataAppsStats,
        refetch: refetchAppsStats,
    } = useClientQuery({
        queryCacheKey: ['getAppsStatsByParams', keywords?.length ? keywords : 'empty_keywords'],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetAppsStatsByParams,
                queryParams: {
                    keywords,
                },
            }),
    });

    useEffect(() => {
        refetchAppsStats?.();
    }, [keywords]);

    if (appsStatsLoading) {
        return <VitalityLoader />;
    }

    if (!dataAppsStats?.getAppsStatsByParams?.length) {
        return <VitalityEmptyView />;
    }

    return (
        <Row
            justify="center"
            align="middle"
            gutter={[0, 24]}
            style={{ marginTop: '2rem', marginBottom: '2rem' }}
        >
            <Col span={24}>
                <AgCharts
                    options={{
                        autoSize: true,
                        theme: 'ag-vivid-dark',
                        data: dataAppsStats?.getAppsStatsByParams,
                        title: {
                            text: VitalityTerms.VITALITY_APP_STATS_GRAPH_TITLE,
                        },
                        series: [
                            {
                                type: 'pie',
                                angleKey: 'total',
                                legendItemKey: 'keyword',
                            },
                        ],
                    }}
                />
            </Col>
        </Row>
    );
};

export default VitalityAppsStatsChart;

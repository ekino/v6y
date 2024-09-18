import { AgCharts } from 'ag-charts-react';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';

import VitalityLoader from '../../../commons/components/VitalityLoader.jsx';
import VitalityApiConfig from '../../../commons/config/VitalityApiConfig.js';
import VitalityTerms from '../../../commons/config/VitalityTerms.js';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter.jsx';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter.jsx';
import GetApplicationStatsByParams from '../api/getApplicationStatsByParams.js';

const VitalityAppsStatsChart = () => {
    const { getUrlParams } = useNavigationAdapter();
    const [keywords] = getUrlParams(['keywords']);

    const {
        isLoading: appsStatsLoading,
        data: dataAppsStats,
        refetch: refetchAppsStats,
    } = useClientQuery({
        queryCacheKey: [
            'getApplicationStatsByParams',
            keywords?.length ? keywords : 'empty_keywords',
        ],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                queryPath: GetApplicationStatsByParams,
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

    if (!dataAppsStats?.getApplicationStatsByParams?.length) {
        // return <VitalityEmptyView />;
    }

    const chartDataSource = (
        !keywords?.length ? [] : dataAppsStats?.getApplicationStatsByParams
    ).map((item) => ({
        label: item.keyword?.label,
        total: item.total,
    }));

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
                        data: [
                            {
                                label: 'Code-Complexity-maintainability-index-project-average',
                                total: 10,
                            },
                            {
                                label: 'Code-Complexity-maintainability-index',
                                total: 10,
                            },
                            {
                                label: 'Code-Complexity-cyclomatic-complexity',
                                total: 10,
                            },
                        ],
                        title: {
                            text: VitalityTerms.VITALITY_APP_STATS_GRAPH_TITLE,
                        },
                        series: [
                            {
                                type: 'pie',
                                angleKey: 'total',
                                legendItemKey: 'label',
                            },
                        ],
                        overlays: {
                            noData: {
                                text: VitalityTerms.VITALITY_APP_STATS_GRAPH_EMPTY_MESSAGE,
                            },
                        },
                    }}
                />
            </Col>
        </Row>
    );
};

export default VitalityAppsStatsChart;

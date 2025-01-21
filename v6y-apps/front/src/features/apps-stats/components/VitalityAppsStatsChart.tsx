import { KeywordStatsType } from '@v6y/core-logic';
import VitalityLoader from '@v6y/shared-ui/src/components/VitalityLoader/VitalityLoader';
import { AgCharts } from 'ag-charts-react';
import { Col, Row } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '@v6y/core-logic/src/config/VitalityTerms';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../infrastructure/adapters/navigation/useNavigationAdapter';
import GetApplicationStatsByParams from '../api/getApplicationStatsByParams';

interface VitalityAppsStatsQueryType {
    isLoading: boolean;
    data?: { getApplicationStatsByParams: KeywordStatsType[] };
    refetch?: () => void;
}

const VitalityAppsStatsChart = () => {
    const { getUrlParams } = useNavigationAdapter();
    const [keywords] = getUrlParams(['keywords']);

    const { isLoading, data, refetch }: VitalityAppsStatsQueryType = useClientQuery({
        queryCacheKey: [
            'getApplicationStatsByParams',
            keywords?.length ? keywords : 'empty_keywords',
        ],
        queryBuilder: async () =>
            buildClientQuery({
                query: GetApplicationStatsByParams,
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                variables: {
                    keywords,
                },
            }),
    });

    useEffect(() => {
        refetch?.();
    }, [keywords]);

    if (isLoading) {
        return <VitalityLoader />;
    }

    const dataSource = data?.getApplicationStatsByParams;

    const chartDataSource = (!keywords?.length ? [] : dataSource)?.map((item) => ({
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
                        theme: 'ag-vivid-dark',
                        data: chartDataSource,
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

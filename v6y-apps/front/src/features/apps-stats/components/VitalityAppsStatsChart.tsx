import * as React from 'react';
import { useEffect } from 'react';

import { KeywordStatsType } from '@v6y/core-logic/src/types';
import {
    Charts,
    Col,
    LoaderView,
    Row,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationStatsByParams from '../api/getApplicationStatsByParams';

const VitalityAppsStatsChart = () => {
    const { translate } = useTranslationProvider();
    const { getUrlParams } = useNavigationAdapter();
    const [keywords] = getUrlParams(['keywords']);

    const { isLoading, data, refetch } = useClientQuery<{
        getApplicationStatsByParams: KeywordStatsType[];
    }>({
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
        return <LoaderView />;
    }

    const dataSource = data?.getApplicationStatsByParams;

    const chartDataSource = (!keywords?.length ? [] : dataSource)?.map((item) => ({
        label: item.keyword?.label,
        total: item.total,
    }));

    return (
        <Row justify="center" align="middle" gutter={[0, 24]}>
            <Col span={24}>
                <Charts
                    options={{
                        theme: 'ag-vivid-dark',
                        data: chartDataSource,
                        title: {
                            text: translate('vitality.appStatsPage.stats.graphTitle'),
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
                                text: translate('vitality.appStatsPage.stats.graphEmptyMessage'),
                            },
                        },
                    }}
                />
            </Col>
        </Row>
    );
};

export default VitalityAppsStatsChart;

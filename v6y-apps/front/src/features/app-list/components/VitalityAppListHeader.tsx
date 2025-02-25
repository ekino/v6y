import {
    Button,
    Col,
    ExportOutlined,
    Row,
    VitalityTitle,
    useNavigationAdapter,
} from '@v6y/shared-ui';
import { useEffect, useState } from 'react';
import * as React from 'react';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../commons/config/VitalityTerms';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationTotalByParams from '../api/getApplicationTotalByParams';

interface VitalityAppListQueryType {
    isLoading: boolean;
    data?: { getApplicationTotalByParams: number };
    refetch: () => void;
}

const VitalityAppListHeader = ({
    onExportApplicationsClicked,
}: {
    onExportApplicationsClicked: () => void;
}) => {
    const [appsTotal, setAppsTotal] = useState(0);

    const { getUrlParams } = useNavigationAdapter();
    const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

    const { data: dataAppsTotal, refetch: refetchAppsTotal }: VitalityAppListQueryType =
        useClientQuery({
            queryCacheKey: [
                'getApplicationTotalByParams',
                keywords?.length ? keywords : 'empty_keywords',
                searchText?.length ? searchText : 'empty_search_text',
            ],
            queryBuilder: async () =>
                buildClientQuery({
                    queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                    query: GetApplicationTotalByParams,
                    variables: {
                        keywords,
                        searchText,
                    },
                }),
        });

    useEffect(() => {
        refetchAppsTotal?.();
    }, [keywords, searchText]);

    useEffect(() => {
        setAppsTotal(dataAppsTotal?.getApplicationTotalByParams || 0);
    }, [dataAppsTotal?.getApplicationTotalByParams]);

    return (
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ textAlign: 'left' }}>
                {appsTotal > 0 && (
                    <VitalityTitle
                        title={`${VitalityTerms.VITALITY_APP_LIST_TOTAL_LABEL} ${appsTotal}`}
                        level={3}
                    />
                )}
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10} style={{ textAlign: 'right' }}>
                <Button icon={<ExportOutlined />} onClick={onExportApplicationsClicked}>
                    {VitalityTerms.VITALITY_APP_LIST_EXPORT_LABEL}
                </Button>
            </Col>
            <Col span={24} />
        </Row>
    );
};

export default VitalityAppListHeader;

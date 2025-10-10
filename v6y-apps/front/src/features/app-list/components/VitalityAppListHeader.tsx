import {
    Button,
    Col,
    ExportOutlined,
    Row,
    TitleView,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';
import { useEffect, useState } from 'react';

import VitalityApiConfig from '../../../commons/config/VitalityApiConfig';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationTotalByParams from '../api/getApplicationTotalByParams';

const VitalityAppListHeader = ({
    onExportApplicationsClicked,
}: {
    onExportApplicationsClicked: () => void;
}) => {
    const [appsTotal, setAppsTotal] = useState(0);

    const { getUrlParams } = useNavigationAdapter();
    const [keywords, searchText] = getUrlParams(['keywords', 'searchText']);

    const { data: dataAppsTotal, refetch: refetchAppsTotal } = useClientQuery<{
        getApplicationTotalByParams: number;
    }>({
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

    const { translate } = useTranslationProvider();
    return (
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                {appsTotal > 0 && (
                    <TitleView
                        title={`${translate('vitality.appListPage.totalLabel')} ${appsTotal}`}
                        level={3}
                    />
                )}
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                <Button icon={<ExportOutlined />} onClick={onExportApplicationsClicked}>
                    {translate('vitality.appListPage.exportLabel')}
                </Button>
            </Col>
            <Col span={24} />
        </Row>
    );
};

export default VitalityAppListHeader;

import { useEffect, useState } from 'react';

import { ExportOutlined } from '@v6y/ui-kit';
import { Button, useNavigationAdapter, useTranslationProvider } from '@v6y/ui-kit-front';

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
    const [appsTotal, setAppsTotal] = useState<number>(0);
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
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL ?? '',
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
        <div className="w-full flex items-center justify-between gap-4">
            <Button onClick={onExportApplicationsClicked}>
                <ExportOutlined />
                {translate('vitality.appListPage.exportLabel')}
            </Button>
            <p>{appsTotal} results</p>
        </div>
    );
};

export default VitalityAppListHeader;

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
    }, [keywords, searchText, refetchAppsTotal]);

    useEffect(() => {
        setAppsTotal(dataAppsTotal?.getApplicationTotalByParams || 0);
    }, [dataAppsTotal?.getApplicationTotalByParams]);

    const { translate } = useTranslationProvider();

    return (
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <Button
                onClick={onExportApplicationsClicked}
                className="w-full md:w-auto h-9 md:h-10 text-sm md:text-base"
            >
                <ExportOutlined className="w-4 h-4" />
                <span className="ml-2">{translate('vitality.appListPage.exportLabel')}</span>
            </Button>
            <p className="text-xs md:text-sm text-slate-600 text-center md:text-right">
                {appsTotal} {appsTotal === 1 ? 'result' : 'results'}
            </p>
        </div>
    );
};

export default VitalityAppListHeader;

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
        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                        Projects under watch
                    </h2>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                        {appsTotal} {appsTotal === 1 ? 'result' : 'results'}
                    </span>
                </div>
                <p className="text-sm text-slate-600">
                    Compare repositories, open the right report quickly, and export the current view when needed.
                </p>
            </div>

            <Button
                onClick={onExportApplicationsClicked}
                className="h-10 w-full rounded-full bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-800 md:w-auto"
            >
                <ExportOutlined className="w-4 h-4" />
                <span className="ml-2">{translate('vitality.appListPage.exportLabel')}</span>
            </Button>
        </div>
    );
};

export default VitalityAppListHeader;

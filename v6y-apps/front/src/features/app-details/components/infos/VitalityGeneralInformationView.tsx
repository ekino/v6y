import { ApplicationType } from '@v6y/core-logic/src/types';
import { DynamicLoader, InfoOutlined, useNavigationAdapter } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import { exportAppDetailsDataToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsInfosByParams from '../../api/getApplicationDetailsInfosByParams';

const VitalityAppInfos = DynamicLoader(
    () => import('../../../../commons/components/application-info/VitalityAppInfos'),
);

interface VitalityGeneralInformationQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsInfoByParams: ApplicationType };
}

const VitalityGeneralInformationView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsInfosLoading,
        data: appDetailsInfos,
    }: VitalityGeneralInformationQueryType = useClientQuery({
        queryCacheKey: ['getApplicationDetailsInfoByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationDetailsInfosByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const appInfos = appDetailsInfos?.getApplicationDetailsInfoByParams;

    const onExportClicked = () => {
        exportAppDetailsDataToCSV(appInfos as ApplicationType);
    };

    return (
        <VitalitySectionView
            isLoading={isAppDetailsInfosLoading}
            isEmpty={!appInfos?.name?.length || !appInfos?.acronym?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_INFOS_TITLE}
            description=""
            avatar={<InfoOutlined />}
            exportButtonLabel={VitalityTerms.VITALITY_APP_DETAILS_INFOS_EXPORT_LABEL}
            onExportClicked={onExportClicked}
        >
            {appInfos && <VitalityAppInfos app={appInfos} canOpenDetails={false} />}
        </VitalitySectionView>
    );
};

export default VitalityGeneralInformationView;

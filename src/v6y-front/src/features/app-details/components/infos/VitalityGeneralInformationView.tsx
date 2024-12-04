import { InfoOutlined } from '@ant-design/icons';
import { ApplicationType } from '@v6y/commons';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import { exportAppDetailsDataToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import GetApplicationDetailsInfosByParams from '../../api/getApplicationDetailsInfosByParams';

const VitalityAppInfos = VitalityDynamicLoader(
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
            {appInfos && (
                <VitalityAppInfos
                    app={appInfos}
                    canOpenDetails={false}
                    style={{ marginTop: '-20px' }}
                />
            )}
        </VitalitySectionView>
    );
};

export default VitalityGeneralInformationView;

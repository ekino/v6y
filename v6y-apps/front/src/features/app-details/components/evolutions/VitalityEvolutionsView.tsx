import { BulbOutlined } from '@ant-design/icons';
import { EvolutionType } from '@v6y/core-logic';
import { useNavigationAdapter } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import { exportAppEvolutionsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsEvolutionsByParams from '../../api/getApplicationDetailsEvolutionsByParams';

const VitalityEvolutionBranchGrouper = VitalityDynamicLoader(
    () => import('./VitalityEvolutionBranchGrouper'),
);

interface VitalityEvolutionsQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsEvolutionsByParams: EvolutionType[] };
}

const VitalityEvolutionsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsEvolutionsLoading,
        data: appDetailsEvolutions,
    }: VitalityEvolutionsQueryType = useClientQuery({
        queryCacheKey: ['getApplicationDetailsEvolutionsByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationDetailsEvolutionsByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const evolutions = appDetailsEvolutions?.getApplicationDetailsEvolutionsByParams
        ?.filter(
            (evolution) =>
                evolution?.module?.branch?.length &&
                evolution?.evolutionHelp?.category?.length &&
                evolution?.evolutionHelp?.title?.length &&
                evolution?.evolutionHelp?.status?.length,
        )
        ?.map((evolution) => ({
            ...evolution,
            ...evolution?.module,
            ...evolution?.evolutionHelp,
        }));

    const onExportClicked = () => {
        exportAppEvolutionsToCSV(evolutions || []);
    };

    return (
        <VitalitySectionView
            isLoading={isAppDetailsEvolutionsLoading}
            isEmpty={!evolutions?.length}
            title={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_TITLE}
            avatar={<BulbOutlined />}
            exportButtonLabel={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_EXPORT_LABEL}
            onExportClicked={onExportClicked}
        >
            {(evolutions?.length || 0) > 0 && (
                <VitalityEvolutionBranchGrouper evolutions={evolutions || []} />
            )}
        </VitalitySectionView>
    );
};

export default VitalityEvolutionsView;

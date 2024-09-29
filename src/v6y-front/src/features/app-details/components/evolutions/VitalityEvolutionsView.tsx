import { exportAppEvolutionsToCSV } from '@/commons/utils/VitalityDataExportUtils';
import { buildClientQuery, useClientQuery } from '@/infrastructure/adapters/api/useQueryAdapter';
import { BulbOutlined } from '@ant-design/icons';
import { EvolutionType } from '@v6y/commons';
import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader';
import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import VitalityTerms from '../../../../commons/config/VitalityTerms';
import useNavigationAdapter from '../../../../infrastructure/adapters/navigation/useNavigationAdapter';
import GetApplicationDetailsEvolutionsByParams from '../../api/getApplicationDetailsEvolutionsByParams';

const VitalityEvolutionBranchGrouper = dynamic(() => import('./VitalityEvolutionBranchGrouper'), {
    loading: () => <VitalityLoader />,
});

interface VitalityEvolutionsQueryType {
    isLoading: boolean;
    data?: { getApplicationDetailsEvolutionsByParams: EvolutionType[] };
}

const VitalityEvolutionsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [appId] = getUrlParams(['appId']);

    const {
        isLoading: isAppDetailsEvolutionsLoading,
        data: appDetailsEvolutions,
    }: VitalityEvolutionsQueryType = useClientQuery({
        queryCacheKey: ['getApplicationDetailsEvolutionsByParams', `${appId}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationDetailsEvolutionsByParams,
                variables: {
                    appId,
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

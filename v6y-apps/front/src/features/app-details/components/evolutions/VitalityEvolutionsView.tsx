import { EvolutionType } from '@v6y/core-logic/src/types';
import {
    BulbOutlined,
    DynamicLoader,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { exportAppEvolutionsToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsEvolutionsByParams from '../../api/getApplicationDetailsEvolutionsByParams';

const VitalityEvolutionBranchGrouper = DynamicLoader(
    () => import('./VitalityEvolutionBranchGrouper'),
);

const VitalityEvolutionsView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsEvolutionsLoading,
        data: appDetailsEvolutions,
    } = useClientQuery<{ getApplicationDetailsEvolutionsByParams: EvolutionType[] }>({
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

    const { translate } = useTranslationProvider();

    return (
        <VitalitySectionView
            isLoading={isAppDetailsEvolutionsLoading}
            isEmpty={!evolutions?.length}
            title={translate('vitality.appDetailsPage.evolutions.title')}
            avatar={<BulbOutlined />}
            exportButtonLabel={translate('vitality.appDetailsPage.evolutions.exportLabel')}
            onExportClicked={onExportClicked}
        >
            {(evolutions?.length || 0) > 0 && (
                <VitalityEvolutionBranchGrouper evolutions={evolutions || []} />
            )}
        </VitalitySectionView>
    );
};

export default VitalityEvolutionsView;

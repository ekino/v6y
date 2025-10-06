import { DependencyType } from '@v6y/core-logic/src/types';
import {
    DynamicLoader,
    ProductOutlined,
    useNavigationAdapter,
    useTranslationProvider,
} from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySectionView from '../../../../commons/components/VitalitySectionView';
import VitalityApiConfig from '../../../../commons/config/VitalityApiConfig';
import { exportAppDependenciesToCSV } from '../../../../commons/utils/VitalityDataExportUtils';
import {
    buildClientQuery,
    useClientQuery,
} from '../../../../infrastructure/adapters/api/useQueryAdapter';
import GetApplicationDetailsDependenciesByParams from '../../api/getApplicationDetailsDependenciesByParams';

const VitalityDependenciesBranchGrouper = DynamicLoader(
    () => import('./VitalityDependenciesBranchGrouper'),
);

const VitalityDependenciesView = ({}) => {
    const { getUrlParams } = useNavigationAdapter();
    const [_id] = getUrlParams(['_id']);

    const {
        isLoading: isAppDetailsDependenciesLoading,
        data: appDetailsDependencies,
    } = useClientQuery<{ getApplicationDetailsDependenciesByParams: DependencyType[] }>({
        queryCacheKey: ['getApplicationDetailsDependenciesByParams', `${_id}`],
        queryBuilder: async () =>
            buildClientQuery({
                queryBaseUrl: VitalityApiConfig.VITALITY_BFF_URL,
                query: GetApplicationDetailsDependenciesByParams,
                variables: {
                    _id: parseInt(_id as string, 10),
                },
            }),
    });

    const dependencies = appDetailsDependencies?.getApplicationDetailsDependenciesByParams
        ?.filter(
            (dependency) =>
                dependency?.module?.branch?.length &&
                dependency?.statusHelp?.category?.length &&
                dependency?.statusHelp?.title?.length,
        )
        ?.map((dependency) => ({
            ...dependency,
            ...dependency?.module,
            ...dependency?.statusHelp,
            status: dependency.status,
        }));

    const onExportClicked = () => {
        exportAppDependenciesToCSV(dependencies as DependencyType[]);
    };

    const { translate } = useTranslationProvider();

    return (
        <VitalitySectionView
            isLoading={isAppDetailsDependenciesLoading}
            isEmpty={!dependencies?.length}
            title={translate('vitality.appDetailsPage.dependencies.title')}
            avatar={<ProductOutlined />}
            exportButtonLabel={translate('vitality.appDetailsPage.dependencies.exportLabel')}
            onExportClicked={onExportClicked}
        >
            <VitalityDependenciesBranchGrouper dependencies={dependencies || []} />
        </VitalitySectionView>
    );
};

export default VitalityDependenciesView;

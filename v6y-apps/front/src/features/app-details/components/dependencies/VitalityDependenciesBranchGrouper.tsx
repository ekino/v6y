import { DependencyType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';

const VitalityDependenciesStatusGrouper = DynamicLoader(
    () => import('./VitalityDependenciesStatusGrouper'),
);

const VitalityDependenciesBranchGrouper = ({
    dependencies,
}: {
    dependencies: DependencyType[];
}) => {
    const { translate } = useTranslationProvider();
    return (
        <VitalitySelectGrouperView
            name="dependencies_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={translate('vitality.appDetailsPage.dependencies.selectPlaceholder')}
            label={translate('vitality.appDetailsPage.dependencies.selectLabel')}
            helper={translate('vitality.appDetailsPage.dependencies.selectHelper')}
            dataSource={dependencies}
            onRenderChildren={(_, data) => {
                return (
                    <VitalityDependenciesStatusGrouper dependencies={data as DependencyType[]} />
                );
            }}
        />
    );
};

export default VitalityDependenciesBranchGrouper;

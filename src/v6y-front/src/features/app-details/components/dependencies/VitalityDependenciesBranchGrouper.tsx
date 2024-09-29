import { DependencyType } from '@v6y/commons';
import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

const VitalityDependenciesStatusGrouper = dynamic(
    () => import('./VitalityDependenciesStatusGrouper'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityDependenciesBranchGrouper = ({
    dependencies,
}: {
    dependencies: DependencyType[];
}) => {
    return (
        <VitalitySelectGrouperView
            name="dependencies_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_SELECT_LABEL}
            label={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_SELECT_LABEL}
            helper={VitalityTerms.VITALITY_APP_DETAILS_DEPENDENCIES_SELECT_HELPER}
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

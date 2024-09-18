import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';

const VitalityDependenciesStatusGrouper = dynamic(
    () => import('./VitalityDependenciesStatusGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityDependenciesBranchGrouper = ({ dependencies }) => {
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
                return <VitalityDependenciesStatusGrouper dependencies={data} />;
            }}
        />
    );
};

export default VitalityDependenciesBranchGrouper;

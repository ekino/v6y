import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';

const VitalityEvolutionStatusGrouper = dynamic(
    () => import('./VitalityEvolutionStatusGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityEvolutionBranchGrouper = ({ evolutions }) => {
    return (
        <VitalitySelectGrouperView
            name="evolution_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_PLACEHOLDER}
            label={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_LABEL}
            helper={VitalityTerms.VITALITY_APP_DETAILS_EVOLUTIONS_SELECT_HELPER}
            dataSource={evolutions}
            onRenderChildren={(_, data) => {
                return <VitalityEvolutionStatusGrouper evolutions={data} />;
            }}
        />
    );
};

export default VitalityEvolutionBranchGrouper;

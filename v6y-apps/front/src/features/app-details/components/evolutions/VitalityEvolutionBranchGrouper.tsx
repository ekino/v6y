import { EvolutionType } from '@v6y/core-logic';
import VitalityTerms from '@v6y/core-logic/src/config/VitalityTerms';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';

const VitalityEvolutionStatusGrouper = VitalityDynamicLoader(
    () => import('./VitalityEvolutionStatusGrouper'),
);

const VitalityEvolutionBranchGrouper = ({ evolutions }: { evolutions: EvolutionType[] }) => {
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
                return <VitalityEvolutionStatusGrouper evolutions={data as EvolutionType[]} />;
            }}
        />
    );
};

export default VitalityEvolutionBranchGrouper;

import { EvolutionType } from '@v6y/core-logic/src/types';
import { DynamicLoader } from '@v6y/shared-ui';
import * as React from 'react';

import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

const VitalityEvolutionStatusGrouper = DynamicLoader(
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

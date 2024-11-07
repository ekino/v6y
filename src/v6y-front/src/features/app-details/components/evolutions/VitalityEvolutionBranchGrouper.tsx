import { EvolutionType } from '@v6y/commons';
import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

const VitalityLoading = () => <VitalityLoader />;

const VitalityEvolutionStatusGrouper = dynamic(() => import('./VitalityEvolutionStatusGrouper'), {
    loading: VitalityLoading,
});

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

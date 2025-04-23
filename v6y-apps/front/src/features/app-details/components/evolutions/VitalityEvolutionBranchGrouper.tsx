import { EvolutionType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';

const VitalityEvolutionStatusGrouper = DynamicLoader(
    () => import('./VitalityEvolutionStatusGrouper'),
);

const VitalityEvolutionBranchGrouper = ({ evolutions }: { evolutions: EvolutionType[] }) => {
    const { translate } = useTranslationProvider();

    return (
        <VitalitySelectGrouperView
            name="evolution_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={translate('vitality.appDetailsPage.evolutions.selectPlaceholder')}
            label={translate('vitality.appDetailsPage.evolutions.selectLabel')}
            helper={translate('vitality.appDetailsPage.evolutions.selectHelper')}
            dataSource={evolutions}
            onRenderChildren={(_, data) => {
                return <VitalityEvolutionStatusGrouper evolutions={data as EvolutionType[]} />;
            }}
        />
    );
};

export default VitalityEvolutionBranchGrouper;

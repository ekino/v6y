import { EvolutionType } from '@v6y/core-logic/src/types';
import { VitalityDynamicLoader } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import { VitalityModuleType } from '../../../../commons/types/VitalityModulesProps';

const VitalityModuleList = VitalityDynamicLoader(
    () => import('../../../../commons/components/modules/VitalityModuleList'),
);

const VitalityEvolutionStatusGrouper = ({ evolutions }: { evolutions: EvolutionType[] }) => {
    return (
        <VitalityTabGrouperView
            name="evolution_status_grouper_tab"
            ariaLabelledby="evolution_status_grouper_tab_content"
            align="center"
            criteria="status"
            hasAllGroup={false}
            dataSource={evolutions}
            onRenderChildren={(status, data) => (
                <div id="evolution_status_grouper_tab_content">
                    <VitalityModuleList modules={data as VitalityModuleType[]} />
                </div>
            )}
        />
    );
};

export default VitalityEvolutionStatusGrouper;

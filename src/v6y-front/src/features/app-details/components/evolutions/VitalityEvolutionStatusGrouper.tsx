import { EvolutionType } from '@v6y/commons';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import { VitalityModuleType } from '../../../../commons/types/VitalityModulesProps';

const VitalityModulesView = VitalityDynamicLoader('../../../../commons/components/modules/VitalityModulesView')

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
                    <VitalityModulesView
                        modules={data as VitalityModuleType[]}
                        source="evolutions"
                        status={status}
                    />
                </div>
            )}
        />
    );
};

export default VitalityEvolutionStatusGrouper;

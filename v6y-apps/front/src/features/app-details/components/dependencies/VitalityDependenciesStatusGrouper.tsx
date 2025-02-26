import { DependencyType } from '@v6y/core-logic/src/types';
import { VitalityDynamicLoader } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import { VitalityModuleType } from '../../../../commons/types/VitalityModulesProps';

const VitalityModuleList = VitalityDynamicLoader(
    () => import('../../../../commons/components/modules/VitalityModuleList'),
);

const VitalityDependenciesStatusGrouper = ({
    dependencies,
}: {
    dependencies: DependencyType[];
}) => {
    return (
        <VitalityTabGrouperView
            name="dependencies_grouper_tab"
            ariaLabelledby="dependencies_grouper_tab_content"
            align="center"
            criteria="status"
            hasAllGroup
            dataSource={dependencies}
            onRenderChildren={(status, data) => (
                <div
                    id="dependencies_grouper_tab_content"
                    data-testid="dependencies_grouper_tab_content"
                >
                    <VitalityModuleList modules={data as VitalityModuleType[]} />
                </div>
            )}
        />
    );
};

export default VitalityDependenciesStatusGrouper;

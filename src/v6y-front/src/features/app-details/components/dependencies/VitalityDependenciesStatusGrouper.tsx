import { DependencyType } from '@v6y/commons';
import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import { VitalityModuleType } from '../../../../commons/types/VitalityModulesProps';

const VitalityModulesView = dynamic(
    () => import('../../../../commons/components/modules/VitalityModulesView'),
    {
        loading: () => <VitalityLoader />,
    },
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
                    <VitalityModulesView
                        modules={data as VitalityModuleType[]}
                        source="dependencies"
                        status={status}
                    />
                </div>
            )}
        />
    );
};

export default VitalityDependenciesStatusGrouper;

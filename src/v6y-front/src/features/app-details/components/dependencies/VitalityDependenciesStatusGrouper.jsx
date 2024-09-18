import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView.jsx';

const VitalityModulesView = dynamic(
    () => import('../../../../commons/components/modules/VitalityModulesView.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityDependenciesStatusGrouper = ({ dependencies }) => {
    return (
        <VitalityTabGrouperView
            name="dependencies_grouper_tab"
            ariaLabelledby="dependencies_grouper_tab_content"
            align="center"
            criteria="status"
            hasAllGroup
            dataSource={dependencies}
            onRenderChildren={(status, data) => (
                <div id="dependencies_grouper_tab_content">
                    <VitalityModulesView modules={data} source="dependencies" status={status} />
                </div>
            )}
        />
    );
};

export default VitalityDependenciesStatusGrouper;

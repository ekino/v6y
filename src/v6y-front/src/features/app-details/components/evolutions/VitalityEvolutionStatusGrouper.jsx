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

const VitalityEvolutionStatusGrouper = ({ evolutions }) => {
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
                    <VitalityModulesView modules={data} source="evolutions" status={status} />
                </div>
            )}
        />
    );
};

export default VitalityEvolutionStatusGrouper;

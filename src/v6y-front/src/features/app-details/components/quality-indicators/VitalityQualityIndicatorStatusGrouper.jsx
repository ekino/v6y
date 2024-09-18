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

const VitalityQualityIndicatorStatusGrouper = ({ indicators }) => {
    return (
        <VitalityTabGrouperView
            name="quality_indicator_grouper_tab"
            ariaLabelledby="quality_indicator_grouper_tab_content"
            align="center"
            criteria="status"
            hasAllGroup={false}
            dataSource={[
                ...indicators?.filter((indicator) => indicator.status === 'deprecated'),
                ...indicators?.filter((indicator) => indicator.status === 'outdated'),
                ...indicators?.filter((indicator) => indicator.status === 'up-to-date'),
                ...indicators?.filter((indicator) => indicator.status === 'error'),
                ...indicators?.filter((indicator) => indicator.status === 'warning'),
                ...indicators?.filter((indicator) => indicator.status === 'success'),
            ]}
            onRenderChildren={(status, data) => (
                <div id="quality_indicator_grouper_tab_content">
                    <VitalityModulesView modules={data} source="indicators" status={status} />
                </div>
            )}
        />
    );
};

export default VitalityQualityIndicatorStatusGrouper;

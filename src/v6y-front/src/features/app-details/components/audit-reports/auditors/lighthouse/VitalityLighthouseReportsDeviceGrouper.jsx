import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader.jsx';
import VitalityTabGrouperView from '../../../../../../commons/components/VitalityTabGrouperView.jsx';

const VitalityLighthouseReportsCategoryGrouper = dynamic(
    () => import('./VitalityLighthouseReportsCategoryGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityLighthouseReportsDeviceGrouper = ({ reports }) => {
    return (
        <VitalityTabGrouperView
            name="lighthouse_device_grouper_tab"
            ariaLabelledby="lighthouse_device_grouper_tab_content"
            align="center"
            criteria="subCategory"
            hasAllGroup={false}
            dataSource={reports}
            onRenderChildren={(_, data) => (
                <div id="lighthouse_device_tab_content">
                    <VitalityLighthouseReportsCategoryGrouper reports={data} />
                </div>
            )}
        />
    );
};

export default VitalityLighthouseReportsDeviceGrouper;

import { AuditType } from '@v6y/core-logic/src/types';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../../../commons/components/VitalityDynamicLoader';
import VitalityTabGrouperView from '../../../../../../commons/components/VitalityTabGrouperView';

const VitalityLighthouseReportsCategoryGrouper = VitalityDynamicLoader(
    () => import('./VitalityLighthouseReportsCategoryGrouper'),
);

const VitalityLighthouseReportsDeviceGrouper = ({ reports }: { reports: AuditType[] }) => {
    return (
        <VitalityTabGrouperView
            name="lighthouse_device_grouper_tab"
            ariaLabelledby="lighthouse_device_grouper_tab_content"
            align="center"
            criteria="subCategory"
            hasAllGroup={false}
            dataSource={reports}
            onRenderChildren={(_, data) => {
                return (
                    <div id="lighthouse_device_tab_content">
                        {data && (
                            <VitalityLighthouseReportsCategoryGrouper
                                reports={data as AuditType[]}
                            />
                        )}
                    </div>
                );
            }}
        />
    );
};

export default VitalityLighthouseReportsDeviceGrouper;

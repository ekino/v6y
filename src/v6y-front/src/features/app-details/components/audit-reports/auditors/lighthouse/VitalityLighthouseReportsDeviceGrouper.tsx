import { AuditType } from '@v6y/commons';
import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader';
import VitalityTabGrouperView from '../../../../../../commons/components/VitalityTabGrouperView';

const VitalityLighthouseReportsCategoryGrouper = dynamic(
    () => import('./VitalityLighthouseReportsCategoryGrouper'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityLighthouseReportsDeviceGrouper = ({ reports }: { reports: AuditType[] }) => {
    console.log('reports', reports);
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
                    {data && (
                        <VitalityLighthouseReportsCategoryGrouper reports={data as AuditType[]} />
                    )}
                </div>
            )}
        />
    );
};

export default VitalityLighthouseReportsDeviceGrouper;

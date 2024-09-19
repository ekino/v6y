import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView.jsx';
import { AUDIT_REPORT_TYPES } from '../../../../commons/config/VitalityCommonConfig.js';


const VitalityCodeStatusReportsBranchGrouper = dynamic(
    () => import('./auditors/code-status/VitalityCodeStatusReportsBranchGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityLighthouseReportsDeviceGrouper = dynamic(
    () => import('./auditors/lighthouse/VitalityLighthouseReportsDeviceGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityAuditReportsTypeGrouper = ({ auditReports }) => {
    return (
        <VitalityTabGrouperView
            name="audit_reports_grouper_tab"
            ariaLabelledby="audit_reports_grouper_tab_content"
            align="center"
            criteria="type"
            hasAllGroup={false}
            dataSource={[
                ...(auditReports?.filter(
                    (report) => report?.type === AUDIT_REPORT_TYPES.lighthouse,
                ) || []),
                ...(auditReports?.filter(
                    (report) => report?.type !== AUDIT_REPORT_TYPES.lighthouse,
                ) || []),
            ]}
            onRenderChildren={(group, data) => (
                <div id="audit_reports_grouper_tab_content">
                    {group === AUDIT_REPORT_TYPES.lighthouse && (
                        <VitalityLighthouseReportsDeviceGrouper reports={data} />
                    )}
                    {(group === AUDIT_REPORT_TYPES.codeModularity ||
                        group === AUDIT_REPORT_TYPES.codeComplexity ||
                        group === AUDIT_REPORT_TYPES.codeCoupling ||
                        group === AUDIT_REPORT_TYPES.codeSecurity ||
                        group === AUDIT_REPORT_TYPES.codeDuplication) && (
                        <VitalityCodeStatusReportsBranchGrouper reports={data} />
                    )}
                </div>
            )}
        />
    );
};

export default VitalityAuditReportsTypeGrouper;

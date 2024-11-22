import { AUDIT_REPORT_TYPES } from '@/commons/config/VitalityCommonConfig';
import { AuditType } from '@v6y/commons';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';


const VitalityCodeStatusReportsBranchGrouper = VitalityDynamicLoader('VitalityCodeStatusReportsBranchGrouper')
const VitalityLighthouseReportsDeviceGrouper = VitalityDynamicLoader('VitalityLighthouseReportsDeviceGrouper')

const VitalityAuditReportsTypeGrouper = ({ auditReports }: { auditReports: AuditType[] }) => {
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
                    {group === AUDIT_REPORT_TYPES.lighthouse && data && (
                        <VitalityLighthouseReportsDeviceGrouper reports={data as AuditType[]} />
                    )}
                    {(group === AUDIT_REPORT_TYPES.codeModularity ||
                        group === AUDIT_REPORT_TYPES.codeComplexity ||
                        group === AUDIT_REPORT_TYPES.codeCoupling ||
                        group === AUDIT_REPORT_TYPES.codeSecurity ||
                        group === AUDIT_REPORT_TYPES.codeDuplication) &&
                        data && (
                            <VitalityCodeStatusReportsBranchGrouper reports={data as AuditType[]} />
                        )}
                </div>
            )}
        />
    );
};

export default VitalityAuditReportsTypeGrouper;

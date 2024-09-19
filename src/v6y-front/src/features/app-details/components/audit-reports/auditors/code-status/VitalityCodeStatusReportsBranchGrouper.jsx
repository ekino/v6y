import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../../../commons/components/VitalityLoader.jsx';
import VitalitySelectGrouperView from '../../../../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityTerms from '../../../../../../commons/config/VitalityTerms.js';

const VitalityCodeStatusReportsSmellGrouper = dynamic(
    () => import('./VitalityCodeStatusReportsSmellGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityCodeStatusReportsBranchGrouper = ({ reports }) => {
    return (
        <VitalitySelectGrouperView
            name="code_status_branch_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_SELECT_PLACEHOLDER}
            label={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_SELECT_LABEL}
            helper={VitalityTerms.VITALITY_APP_DETAILS_AUDIT_SELECT_HELPER}
            dataSource={reports}
            onRenderChildren={(_, data) => <VitalityCodeStatusReportsSmellGrouper reports={data} />}
        />
    );
};

export default VitalityCodeStatusReportsBranchGrouper;

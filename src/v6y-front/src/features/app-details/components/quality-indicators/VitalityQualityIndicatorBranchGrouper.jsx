import dynamic from 'next/dynamic.js';
import React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader.jsx';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView.jsx';
import VitalityTerms from '../../../../commons/config/VitalityTerms.js';

const VitalityQualityIndicatorStatusGrouper = dynamic(
    () => import('./VitalityQualityIndicatorStatusGrouper.jsx'),
    {
        loading: () => <VitalityLoader />,
    },
);

const VitalityQualityIndicatorBranchGrouper = ({ indicators }) => {
    return (
        <VitalitySelectGrouperView
            name="quality_indicator_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_SELECT_PLACEHOLDER}
            label={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_SELECT_LABEL}
            helper={VitalityTerms.VITALITY_APP_DETAILS_QUALITY_SELECT_HELPER}
            dataSource={indicators}
            onRenderChildren={(_, data) => {
                return <VitalityQualityIndicatorStatusGrouper indicators={data} />;
            }}
        />
    );
};

export default VitalityQualityIndicatorBranchGrouper;

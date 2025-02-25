import { KeywordType } from '@v6y/core-logic/src/types';
import * as React from 'react';

import VitalityDynamicLoader from '../../../../commons/components/VitalityDynamicLoader';
import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

const VitalityQualityIndicatorStatusGrouper = VitalityDynamicLoader(
    () => import('./VitalityQualityIndicatorStatusGrouper'),
);

const VitalityQualityIndicatorBranchGrouper = ({ indicators }: { indicators: KeywordType[] }) => {
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
                return <VitalityQualityIndicatorStatusGrouper indicators={data as KeywordType[]} />;
            }}
        />
    );
};

export default VitalityQualityIndicatorBranchGrouper;

import { KeywordType } from '@v6y/core-logic/src/types';
import { DynamicLoader } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';
import VitalityTerms from '../../../../commons/config/VitalityTerms';

const VitalityQualityIndicatorStatusGrouper = DynamicLoader(
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

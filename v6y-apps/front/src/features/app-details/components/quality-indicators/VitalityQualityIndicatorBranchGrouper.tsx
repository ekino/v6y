import { KeywordType } from '@v6y/core-logic/src/types';
import { DynamicLoader, useTranslationProvider } from '@v6y/ui-kit';
import * as React from 'react';

import VitalitySelectGrouperView from '../../../../commons/components/VitalitySelectGrouperView';

const VitalityQualityIndicatorStatusGrouper = DynamicLoader(
    () => import('./VitalityQualityIndicatorStatusGrouper'),
);

const VitalityQualityIndicatorBranchGrouper = ({ indicators }: { indicators: KeywordType[] }) => {
    const { translate } = useTranslationProvider();
    return (
        <VitalitySelectGrouperView
            name="quality_indicator_grouper_select"
            criteria="branch"
            hasAllGroup
            placeholder={translate('vitality.appDetailsPage.qualityStatus.selectPlaceholder')}
            label={translate('vitality.appDetailsPage.qualityStatus.selectLabel')}
            helper={translate('vitality.appDetailsPage.qualityStatus.selectHelper')}
            dataSource={indicators}
            onRenderChildren={(_, data) => {
                return <VitalityQualityIndicatorStatusGrouper indicators={data as KeywordType[]} />;
            }}
        />
    );
};

export default VitalityQualityIndicatorBranchGrouper;

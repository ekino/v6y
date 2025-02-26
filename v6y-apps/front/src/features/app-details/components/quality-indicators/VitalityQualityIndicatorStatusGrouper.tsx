import { KeywordType } from '@v6y/core-logic/src/types';
import { VitalityDynamicLoader } from '@v6y/shared-ui';
import * as React from 'react';

import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import { VitalityModuleType } from '../../../../commons/types/VitalityModulesProps';

const VitalityModuleList = VitalityDynamicLoader(
    () => import('../../../../commons/components/modules/VitalityModuleList'),
);

const VitalityQualityIndicatorStatusGrouper = ({ indicators }: { indicators: KeywordType[] }) => {
    return (
        <VitalityTabGrouperView
            name="quality_indicator_grouper_tab"
            ariaLabelledby="quality_indicator_grouper_tab_content"
            align="center"
            criteria="status"
            hasAllGroup={false}
            dataSource={[
                ...indicators?.filter((indicator) => indicator.status === 'deprecated'),
                ...indicators?.filter((indicator) => indicator.status === 'outdated'),
                ...indicators?.filter((indicator) => indicator.status === 'up-to-date'),
                ...indicators?.filter((indicator) => indicator.status === 'error'),
                ...indicators?.filter((indicator) => indicator.status === 'warning'),
                ...indicators?.filter((indicator) => indicator.status === 'success'),
            ]}
            onRenderChildren={(status, data) => {
                return (
                    <div id="quality_indicator_grouper_tab_content">
                        <VitalityModuleList modules={data as VitalityModuleType[]} />
                    </div>
                );
            }}
        />
    );
};

export default VitalityQualityIndicatorStatusGrouper;

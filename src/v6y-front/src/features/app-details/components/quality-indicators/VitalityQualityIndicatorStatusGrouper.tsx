import { KeywordType } from '@v6y/commons';
import dynamic from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from '../../../../commons/components/VitalityLoader';
import VitalityTabGrouperView from '../../../../commons/components/VitalityTabGrouperView';
import { VitalityModuleType } from '../../../../commons/types/VitalityModulesProps';

const VitalityModulesView = dynamic(
    () => import('../../../../commons/components/modules/VitalityModulesView'),
    {
        loading: () => <VitalityLoader />,
    },
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
            onRenderChildren={(status, data) => (
                <div id="quality_indicator_grouper_tab_content">
                    <VitalityModulesView
                        modules={data as VitalityModuleType[]}
                        source="indicators"
                        status={status}
                    />
                </div>
            )}
        />
    );
};

export default VitalityQualityIndicatorStatusGrouper;

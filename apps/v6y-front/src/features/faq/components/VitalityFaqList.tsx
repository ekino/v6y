import { FaqType } from '@v6y/core-logic/src';
import * as React from 'react';

import VitalityCollapse from '../../../commons/components/VitalityCollapse';
import VitalityLinks from '../../../commons/components/VitalityLinks';
import { CollapseItemType } from '../../../commons/types/VitalityCollapseProps';

const VitalityFaqList = ({ dataSource }: { dataSource: FaqType[] }) => {
    if (!dataSource?.length) {
        return null;
    }

    const faqList: CollapseItemType[] = dataSource
        .filter((option: FaqType) => option.title?.length)
        .map((option: FaqType) => ({
            key: option.title || '',
            label: option.title || '',
            children: (
                <>
                    <p>{option.description}</p>
                    <VitalityLinks links={option.links || []} />
                </>
            ),
            showArrow: true,
        }));

    return <VitalityCollapse accordion bordered dataSource={faqList} />;
};

export default VitalityFaqList;

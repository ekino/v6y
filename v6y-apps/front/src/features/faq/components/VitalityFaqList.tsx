import { FaqType } from '@v6y/core-logic/src/types';
import { CollapseItemType, CollapseView, Links } from '@v6y/shared-ui';
import * as React from 'react';

const VitalityFaqList = ({ dataSource }: { dataSource?: FaqType[] }) => {
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
                    <Links links={option.links || []} />
                </>
            ),
            showArrow: true,
        }));

    return <CollapseView accordion bordered dataSource={faqList} />;
};

export default VitalityFaqList;

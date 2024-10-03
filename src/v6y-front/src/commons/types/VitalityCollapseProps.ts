import * as React from 'react';

export interface CollapseItemType {
    key: string;
    label: string;
    children?: React.ReactNode;
    showArrow?: boolean;
}

export interface VitalityCollapseProps {
    bordered?: boolean;
    accordion?: boolean;
    dataSource?: CollapseItemType[];
}

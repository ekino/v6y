import * as React from 'react';

export interface CollapseItemType {
    key: string;
    label: string;
    children?: React.ReactNode;
    showArrow?: boolean;
}

export interface CollapseProps {
    bordered?: boolean;
    accordion?: boolean;
    dataSource?: CollapseItemType[];
}

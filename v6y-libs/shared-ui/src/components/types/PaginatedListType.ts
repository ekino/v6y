import { CSSProperties, ReactNode } from 'react';

import { ListGridType } from './ListType';

export interface PaginatedListType {
    dataSource: unknown[];
    pageSize?: number;
    bordered?: boolean;
    loadMoreLabel?: string;
    grid?: ListGridType;
    header?: ReactNode;
    renderItem: (item: unknown, index: number) => ReactNode;
    showFooter?: boolean;
    style?: CSSProperties;
    onLoadMore?: () => void;
    isDataSourceLoading?: boolean;
}

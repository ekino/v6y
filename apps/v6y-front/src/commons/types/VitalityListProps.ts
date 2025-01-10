import { ListGridType } from 'antd/es/list';
import { CSSProperties, ReactNode } from 'react';

export interface VitalityListProps {
    dataSource: unknown[];
    pageSize?: number;
    bordered?: boolean;
    grid?: ListGridType;
    header?: ReactNode;
    renderItem: (item: unknown, index: number) => ReactNode;
    showFooter?: boolean;
    style?: CSSProperties;
    onLoadMore?: () => void;
    isDataSourceLoading?: boolean;
}

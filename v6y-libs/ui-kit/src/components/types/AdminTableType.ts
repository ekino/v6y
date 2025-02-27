import type { CrudSort } from '@refinedev/core';
import { MetaQuery } from '@refinedev/core';
import { ReactNode } from 'react';

export interface AdminTableType<T> {
    title: string | ReactNode | undefined;
    subTitle?: string;
    queryOptions: {
        resource: string;
        query: string;
        queryParams?: Record<string, unknown>;
    };
    defaultSorter?: CrudSort[];
    renderContent: (dataSource: T[]) => ReactNode;
}

export interface AdminTableOptions {
    enableEdit?: boolean;
    enableShow?: boolean;
    enableDelete?: boolean;
    deleteMetaQuery?: MetaQuery;
}

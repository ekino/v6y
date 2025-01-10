import type { CrudSort } from '@refinedev/core';
import { ReactNode } from 'react';

export interface RefineTableType<T> {
    title: string | ReactNode | undefined;
    subTitle?: string;
    queryOptions: {
        resource: string;
        query: string;
    };
    defaultSorter?: CrudSort[];
    renderTable: (dataSource: T[]) => ReactNode;
}

export interface RefineTableOptions {
    enableEdit?: boolean;
    enableShow?: boolean;
    enableDelete?: boolean;
    deleteMetaQuery?: unknown;
}

import { List, RefreshButton, useTable } from '@refinedev/antd';
import { BaseRecord, HttpError } from '@refinedev/core';
import { ReactNode } from 'react';

import { gqlClientRequest } from '../../../api';
import { AdminTableType } from '../../types';
import VitalityLoader from '../app/VitalityLoader.tsx';
import VitalityTitle from '../app/VitalityTitle.tsx';

export default function AdminTableWrapper<T extends BaseRecord>({
    title,
    subTitle,
    queryOptions,
    defaultSorter,
    renderTable,
}: AdminTableType<T>) {
    const { tableQuery } = useTable<T, HttpError>({
        initialSorter: defaultSorter,
        queryOptions: {
            enabled: true,
            queryKey: [queryOptions?.resource],
            queryFn: async () =>
                gqlClientRequest({
                    gqlQueryPath: queryOptions?.query,
                    gqlQueryParams: queryOptions?.queryParams,
                }),
        },
    });

    const handleRefresh = () => {
        tableQuery?.refetch?.();
    };

    if (tableQuery?.isLoading || tableQuery?.isFetching) {
        return <VitalityLoader />;
    }

    const dataSource = tableQuery?.data?.[queryOptions?.resource] || [];

    return (
        <section>
            <VitalityTitle title={title} />
            <List
                title={subTitle}
                headerButtons={({ defaultButtons }: { defaultButtons: ReactNode }) => (
                    <>
                        {defaultButtons}
                        <RefreshButton
                            loading={tableQuery?.isLoading || tableQuery?.isFetching}
                            onClick={handleRefresh}
                        />
                    </>
                )}
            >
                {renderTable(dataSource as T[])}
            </List>
        </section>
    );
}

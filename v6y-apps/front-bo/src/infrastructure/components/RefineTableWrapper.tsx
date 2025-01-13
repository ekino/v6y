import { List, RefreshButton, useTable } from '@refinedev/antd';
import { Typography } from 'antd';
import { ReactNode } from 'react';

import VitalityLoader from '../../commons/components/VitalityLoader';
import { RefineTableType } from '../types/RefineTableType';

export default function RefineTableWrapper<T>({
    title,
    subTitle,
    queryOptions,
    defaultSorter,
    renderTable,
}: RefineTableType<T>) {
    const { tableProps, tableQuery } = useTable({
        resource: queryOptions?.resource,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        meta: { gqlQuery: queryOptions?.query },
        initialSorter: defaultSorter,
    });

    const { dataSource } = tableProps || {};

    const handleRefresh = () => {
        tableQuery?.refetch?.();
    };

    if (tableQuery?.isLoading || tableQuery?.isFetching) {
        return <VitalityLoader />;
    }

    return (
        <section>
            <Typography.Title level={2}>{title}</Typography.Title>
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

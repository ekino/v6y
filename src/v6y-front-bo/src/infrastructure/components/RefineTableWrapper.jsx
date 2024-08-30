import { List, RefreshButton, useTable } from '@refinedev/antd';
import { Typography } from 'antd';

export default function RefineTableWrapper({
    title,
    subTitle,
    queryOptions,
    defaultSorter,
    renderTable,
}) {
    const { tableProps, tableQueryResult } = useTable({
        resource: queryOptions?.resource,
        meta: { gqlQuery: queryOptions?.query },
        initialSorter: defaultSorter,
    });

    const { dataSource } = tableProps || {};

    const handleRefresh = () => {
        tableQueryResult?.refetch?.();
    };

    return (
        <section>
            <Typography.Title level={2}>{title}</Typography.Title>
            <List
                title={subTitle}
                headerButtons={({ defaultButtons }) => (
                    <>
                        {defaultButtons}
                        <RefreshButton
                            loading={tableQueryResult?.isLoading || tableQueryResult?.isFetching}
                            onClick={handleRefresh}
                        />
                    </>
                )}
            >
                {renderTable(dataSource)}
            </List>
        </section>
    );
}

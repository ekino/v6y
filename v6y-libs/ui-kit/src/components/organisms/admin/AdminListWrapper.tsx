import { useTable } from '@refinedev/antd';
import { BaseRecord, HttpError } from '@refinedev/core';
import { ReactNode } from 'react';

import { gqlClientRequest } from '../../../api';
import { ListLayout, RefreshButton } from '../../atoms';
import { AdminTableType } from '../../types';
import LoaderView from '../app/LoaderView.tsx';
import TitleView from '../app/TitleView.tsx';

const AdminListWrapper = <T extends BaseRecord>({
    title,
    subTitle,
    queryOptions,
    defaultSorter,
    renderContent,
}: AdminTableType<T>) => {
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
        return <LoaderView />;
    }

    const dataSource = tableQuery?.data?.[queryOptions?.resource] || [];

    return (
        <section>
            <TitleView title={title} />
            <ListLayout
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
                {renderContent(dataSource as T[])}
            </ListLayout>
        </section>
    );
};

export default AdminListWrapper;

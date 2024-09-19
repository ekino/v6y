'use client';

import { RefreshButton, Show } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import GraphqlClientRequest from 'graphql-request';

export default function RefineShowWrapper({ title, renderShowView, queryOptions }) {
    const { query: queryResult } = useShow({
        queryOptions: {
            enabled: true,
            queryFn: async () =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
                    queryOptions?.query,
                    queryOptions?.queryParams,
                ),
        },
    });

    const {
        data: resourceQueryData,
        isLoading: resourceQueryIsLoading,
        error: resourceQueryError,
    } = queryResult || {};

    return (
        <Show
            title={title}
            isLoading={resourceQueryIsLoading}
            headerProps={{
                extra: (
                    <RefreshButton
                        onClick={() => {
                            queryResult.refetch();
                        }}
                    />
                ),
            }}
        >
            {renderShowView?.({
                data: resourceQueryData?.[queryOptions?.resource],
                error: resourceQueryError,
            })}
        </Show>
    );
}

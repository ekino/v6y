'use client';

import { RefreshButton, Show } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, useShow } from '@refinedev/core';
import GraphqlClientRequest from 'graphql-request';

import { FormShowOptions } from '../types/FormType';

export default function RefineShowWrapper({
    title,
    renderShowView,
    queryOptions,
}: FormShowOptions) {
    const { query } = useShow({
        queryOptions: {
            enabled: queryOptions?.enabled || true,
            queryKey: [queryOptions?.resource, queryOptions?.queryParams],
            queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string,
                    queryOptions?.query as string,
                    queryOptions?.queryParams,
                ),
        },
    });

    const {
        data: resourceQueryData,
        isLoading: resourceQueryIsLoading,
        error: resourceQueryError,
    } = query || {};

    return (
        <Show
            title={title}
            isLoading={resourceQueryIsLoading}
            headerProps={{
                extra: (
                    <RefreshButton
                        onClick={() => {
                            query.refetch();
                        }}
                    />
                ),
            }}
        >
            {renderShowView?.({
                data: resourceQueryData?.[queryOptions?.resource as keyof typeof resourceQueryData],
                error: resourceQueryError,
            })}
        </Show>
    );
}

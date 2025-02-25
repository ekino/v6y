'use client';

import { RefreshButton, Show } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, useShow } from '@refinedev/core';

import { gqlClientRequest } from '../../../api';
import { FormShowOptions } from '../../types';

export default function AdminShowWrapper({ title, renderShowView, queryOptions }: FormShowOptions) {
    const { query } = useShow({
        queryOptions: {
            enabled: queryOptions?.enabled || true,
            queryKey: [queryOptions?.resource, queryOptions?.queryParams],
            queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                gqlClientRequest({
                    gqlQueryPath: queryOptions?.query,
                    gqlQueryParams: queryOptions?.queryParams,
                }),
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
                error: resourceQueryError || undefined,
            })}
        </Show>
    );
}

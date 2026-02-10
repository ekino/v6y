'use client';

import { BaseRecord, GetOneResponse, useShow } from '@refinedev/core';

import { gqlClientRequest } from '../../../api/GraphQLClient';
import RefreshButton from '../../atoms/admin/RefreshButton';
import ShowLayout from '../../atoms/admin/ShowLayout';
import { FormShowOptions } from '../../types/FormType';

const AdminShowWrapper = ({ title, renderShowView, queryOptions }: FormShowOptions) => {
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
        <ShowLayout
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
        </ShowLayout>
    );
};

export default AdminShowWrapper;

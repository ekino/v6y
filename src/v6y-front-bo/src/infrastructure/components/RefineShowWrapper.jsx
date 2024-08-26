'use client';

import { Show } from '@refinedev/antd';
import { useOne, useShow } from '@refinedev/core';

export default function RefineShowWrapper({ renderShowView, onBuildResourceOptions }) {
    const { query: queryResult } = useShow({});
    const { data: mainQueryData, isLoading: mainQueryIsLoading } = queryResult;

    const { data: resourceQueryData, isLoading: resourceQueryIsLoading } = useOne({
        ...(onBuildResourceOptions(mainQueryData?.data) || {}),
    });

    return (
        <Show isLoading={mainQueryIsLoading}>
            {renderShowView?.({
                record: mainQueryData?.data,
                resourceQueryData,
                resourceQueryIsLoading,
            })}
        </Show>
    );
}

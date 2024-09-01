'use client';

import { Edit, useForm, useSelect } from '@refinedev/antd';
import { Form } from 'antd';
import GraphqlClientRequest from 'graphql-request';
import { useEffect } from 'react';

export default function RefineSelectWrapper({
    title,
    queryOptions,
    mutationOptions,
    selectOptions,
    formItems,
}) {
    const { form, formProps, saveButtonProps, queryResult } = useForm({
        queryOptions: {
            enabled: true,
            queryFn: async () =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
                    queryOptions?.query,
                    queryOptions?.queryParams,
                ),
        },
        updateMutationOptions: {
            mutationFn: async () =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
                    mutationOptions?.editQuery,
                    mutationOptions?.editFormAdapter?.({
                        ...(mutationOptions?.editQueryParams || {}),
                        ...(form?.getFieldsValue() || {}),
                    }) || {},
                ),
        },
    });

    const { queryResult: selectQueryResult } = useSelect({
        resource: selectOptions?.resource,
        meta: { gqlQuery: selectOptions?.query },
    });

    useEffect(() => {
        const formDetails = queryResult?.data?.[queryOptions?.queryResource];
        if (Object.keys(formDetails || {})?.length) {
            form?.setFieldsValue(queryOptions?.queryFormAdapter?.(formDetails));
        }
    }, [queryResult?.data?.[queryOptions?.queryResource]]);

    return (
        <Edit
            isLoading={selectQueryResult?.isLoading || queryResult?.isLoading}
            canDelete={false}
            title={title}
            saveButtonProps={saveButtonProps}
        >
            <Form {...formProps} layout="vertical" variant="filled">
                {formItems?.(selectQueryResult?.data?.data)?.map((item) => item)}
            </Form>
        </Edit>
    );
}

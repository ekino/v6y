'use client';

import { Edit, useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { Form } from 'antd';
import GraphqlClientRequest from 'graphql-request';
import { useEffect } from 'react';

import { FormWrapperProps } from '../types/FormType';

export default function RefineEditWrapper({
    title,
    queryOptions,
    mutationOptions,
    formItems,
}: FormWrapperProps) {
    const { form, formProps, saveButtonProps, query } = useForm({
        queryOptions: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            queryKey: [queryOptions?.resource, queryOptions?.queryParams],
            queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string,
                    queryOptions?.query as string,
                    queryOptions?.queryParams,
                ),
        },
        updateMutationOptions: {
            mutationKey: [mutationOptions?.resource, mutationOptions?.editQuery],
            mutationFn: async () =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string,
                    mutationOptions?.editQuery,
                    mutationOptions?.editFormAdapter?.({
                        ...(mutationOptions?.editQueryParams || {}),
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        ...(form?.getFieldsValue() || {}),
                    }) || {},
                ),
        },
    });

    useEffect(() => {
        const formDetails = query?.data?.[
            queryOptions?.queryResource as keyof typeof query.data
        ] as Record<string, unknown> | undefined;
        if (formDetails && Object.keys(formDetails).length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            form?.setFieldsValue(
                queryOptions?.queryFormAdapter?.(formDetails as Record<string, unknown>) || {},
            );
        }
    }, [form, query, queryOptions]);

    if (!formItems?.length) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onValuesChange, ...otherFormProps } = formProps || {};

    return (
        <Edit canDelete={false} title={title} saveButtonProps={saveButtonProps}>
            <Form {...otherFormProps} layout="vertical" variant="filled">
                {formItems?.map((item) => item)}
            </Form>
        </Edit>
    );
}

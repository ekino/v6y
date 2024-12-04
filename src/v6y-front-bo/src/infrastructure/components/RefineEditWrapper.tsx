// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import { Edit, useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { Form } from 'antd';
import { useEffect } from 'react';

import { gqlClientRequest } from '../adapters/api/GraphQLClient';
import { FormWrapperProps } from '../types/FormType';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export default function RefineEditWrapper({
    title,
    queryOptions,
    mutationOptions,
    formItems,
}: FormWrapperProps) {
    const { form, formProps, saveButtonProps, query } = useForm({
        queryOptions: {
            queryKey: [queryOptions?.resource, queryOptions?.queryParams],
            queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                gqlClientRequest({
                    gqlQueryPath: queryOptions?.query,
                    gqlQueryParams: queryOptions?.queryParams,
                }),
        },
        updateMutationOptions: {
            mutationKey: [mutationOptions?.resource, mutationOptions?.editQuery],
            mutationFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                gqlClientRequest({
                    gqlQueryPath: mutationOptions?.editQuery,
                    gqlQueryParams:
                        mutationOptions?.editFormAdapter?.({
                            ...(mutationOptions?.editQueryParams || {}),
                            ...(form?.getFieldsValue() || {}),
                        }) || {},
                }),
        },
    });

    useEffect(() => {
        const formDetails = query?.data?.[
            queryOptions?.queryResource as keyof typeof query.data
        ] as Record<string, unknown> | undefined;
        if (formDetails && Object.keys(formDetails).length) {
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

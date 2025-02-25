'use client';

import { Edit, useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, UseFormProps, UseUpdateProps } from '@refinedev/core';
import { Form } from 'antd';
import { useEffect } from 'react';

import { gqlClientRequest } from '../../../api';
import { FormWrapperProps } from '../../types';

export default function AdminEditWrapper({
    title,
    queryOptions,
    mutationOptions,
    formItems,
}: FormWrapperProps) {
    const { form, formProps, saveButtonProps, query } = useForm<UseFormProps>({
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
                    gqlQueryParams: (mutationOptions?.editFormAdapter?.({
                        ...(mutationOptions?.editQueryParams || {}),
                        ...(form?.getFieldsValue() || {}),
                    }) || {}) as Record<string, unknown>,
                }),
        } as UseUpdateProps,
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

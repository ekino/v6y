'use client';

import { useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, UseFormProps, UseUpdateProps } from '@refinedev/core';
import { useEffect } from 'react';

import { gqlClientRequest } from '../../../api';
import { EditLayout, Form } from '../../atoms';
import { FormWrapperType } from '../../types';

const AdminEditWrapper = ({ title, queryOptions, mutationOptions, formItems }: FormWrapperType) => {
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
        <EditLayout canDelete={false} title={title} saveButtonProps={saveButtonProps}>
            <Form {...otherFormProps} layout="vertical" variant="filled">
                {formItems?.map((item) => item)}
            </Form>
        </EditLayout>
    );
};

export default AdminEditWrapper;

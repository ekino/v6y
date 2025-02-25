'use client';

import { Create, useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, UseCreateProps, UseFormProps } from '@refinedev/core';
import { Form } from 'antd';

import { gqlClientRequest } from '../../../api';
import { FormCreateWrapperType } from '../../types';

export default function AdminCreateWrapper({
    title,
    createOptions,
    formItems,
}: FormCreateWrapperType) {
    const { form, formProps, saveButtonProps } = useForm<UseFormProps>({
        defaultFormValues: {},
        createMutationOptions: {
            mutationFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                gqlClientRequest({
                    gqlQueryPath: createOptions?.createQuery,
                    gqlQueryParams: (createOptions?.createFormAdapter?.({
                        ...(createOptions?.createQueryParams || {}),
                        ...(form?.getFieldsValue() || {}),
                    }) || {}) as Record<string, unknown>,
                }),
        } as UseCreateProps,
    });

    if (!formItems?.length) {
        return null;
    }

    return (
        <Create title={title} saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" variant="filled">
                {formItems?.map((item) => item)}
            </Form>
        </Create>
    );
}

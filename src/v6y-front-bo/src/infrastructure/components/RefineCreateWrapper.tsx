// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import { Create, useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { Form } from 'antd';

import { gqlClientRequest } from '../adapters/api/GraphQLClient';
import { FormCreateOptionsType } from '../types/FormType';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export default function RefineCreateWrapper({
    title,
    createOptions,
    formItems,
}: FormCreateOptionsType) {
    const { form, formProps, saveButtonProps } = useForm({
        defaultFormValues: {},
        createMutationOptions: {
            mutationFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                gqlClientRequest({
                    gqlQueryPath: createOptions?.createQuery,
                    gqlQueryParams:
                        createOptions?.createFormAdapter?.({
                            ...(createOptions?.createQueryParams || {}),
                            ...(form?.getFieldsValue() || {}),
                        }) || {},
                }),
        },
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

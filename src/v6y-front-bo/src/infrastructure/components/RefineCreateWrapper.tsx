'use client';

import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';

import { FormCreateOptionsType } from '../types/FormType';
import { gqlClientRequest } from '../adapters/api/GraphQLClient';
import { BaseRecord, GetOneResponse } from '@refinedev/core';

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
                    gqlQueryParams: createOptions?.createFormAdapter?.({
                        ...(createOptions?.createQueryParams || {}),
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        ...(form?.getFieldsValue() || {}),
                    }) || {},
                })
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

'use client';

import { Create, useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { Form } from 'antd';

import { gqlClientRequest } from '../adapters/api/GraphQLClient';
import { FormCreateOptionsType } from '../types/FormType';

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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    gqlQueryParams:
                        createOptions?.createFormAdapter?.({
                            ...(createOptions?.createQueryParams || {}),
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
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

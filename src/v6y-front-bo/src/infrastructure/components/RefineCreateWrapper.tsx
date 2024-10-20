'use client';

import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import GraphqlClientRequest from 'graphql-request';

import { FormCreateOptionsType } from '../types/FormType';

export default function RefineCreateWrapper({
    title,
    createOptions,
    formItems,
}: FormCreateOptionsType) {
    const { form, formProps, saveButtonProps } = useForm({
        defaultFormValues: {},
        createMutationOptions: {
            mutationFn: async () =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string,
                    createOptions?.createQuery,
                    createOptions?.createFormAdapter?.({
                        ...(createOptions?.createQueryParams || {}),
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        ...(form?.getFieldsValue() || {}),
                    }) || {},
                ),
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

'use client';

import { Create, useForm } from '@refinedev/antd';
import { Form } from 'antd';
import GraphqlClientRequest from 'graphql-request';

export default function RefineCreateWrapper({ title, createOptions, formItems }) {
    const { form, formProps, saveButtonProps } = useForm({
        createMutationOptions: {
            mutationFn: async () =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
                    createOptions?.createQuery,
                    createOptions?.createFormAdapter?.({
                        ...(createOptions?.createQueryParams || {}),
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

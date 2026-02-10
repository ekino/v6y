'use client';

import { useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, UseCreateProps, UseFormProps } from '@refinedev/core';

import { gqlClientRequest } from '../../../api/GraphQLClient';
import CreateLayout from '../../atoms/admin/CreateLayout';
import Form from '../../atoms/app/Form';
import { FormCreateWrapperType } from '../../types/FormType';

const AdminCreateWrapper = ({ title, createOptions, formItems }: FormCreateWrapperType) => {
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
        <CreateLayout title={title} saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical" variant="filled">
                {formItems?.map((item) => item)}
            </Form>
        </CreateLayout>
    );
};

export default AdminCreateWrapper;

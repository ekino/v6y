'use client';

import { Edit, useForm, useSelect } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { Form } from 'antd';
import GraphqlClientRequest from 'graphql-request';
import { ReactNode, useEffect } from 'react';

import { FormWrapperProps } from '../types/FormType';

export default function RefineSelectWrapper({
    title,
    queryOptions,
    mutationOptions,
    selectOptions,
    renderSelectOption,
}: FormWrapperProps) {
    const { form, formProps, saveButtonProps, query } = useForm({
        queryOptions: {
            enabled: true,
            queryKey: [queryOptions?.resource, queryOptions?.queryParams],
            queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
                    queryOptions?.query,
                    queryOptions?.queryParams,
                ),
        },
        updateMutationOptions: {
            mutationKey: ['update', mutationOptions?.editQuery],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            mutationFn: async () => {
                const { editQuery, editFormAdapter, editQueryParams } = mutationOptions;
                return GraphqlClientRequest(
                    process.env.NEXT_PUBLIC_GQL_API_BASE_PATH,
                    editQuery,
                    editFormAdapter?.({
                        ...(editQueryParams || {}),
                        ...(form?.getFieldsValue() || {}),
                    }) || {},
                );
            },
        },
    });

    const { query: selectQueryResult } = useSelect({
        resource: selectOptions?.resource,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        meta: { gqlQuery: selectOptions?.query },
    });

    useEffect(() => {
        const formDetails = query?.data?.[queryOptions?.queryResource];
        if (Object.keys(formDetails || {})?.length) {
            form?.setFieldsValue(queryOptions?.queryFormAdapter?.(formDetails));
        }
    }, [form, query?.data, queryOptions]);

    return (
        <Edit
            isLoading={selectQueryResult?.isLoading || query?.isLoading}
            canDelete={false}
            title={title}
            saveButtonProps={saveButtonProps}
        >
            <Form {...formProps} layout="vertical" variant="filled">
                {renderSelectOption?.(selectQueryResult?.data?.data)?.map(
                    (item: ReactNode) => item,
                )}
            </Form>
        </Edit>
    );
}

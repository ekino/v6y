'use client';

import { Edit, useForm, useSelect } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { Form } from 'antd';
import { ReactNode, useEffect } from 'react';

import { gqlClientRequest } from '../adapters/api/GraphQLClient';
import { FormWrapperProps } from '../types/FormType';

export default function RefineSelectWrapper({
    title,
    queryOptions,
    mutationOptions,
    createOptions,
    selectOptions,
    renderSelectOption,
}: FormWrapperProps) {
    const formQueryOptions = queryOptions
        ? {
              queryOptions: {
                  enabled: true,
                  queryKey: [queryOptions?.resource, queryOptions?.queryParams],
                  queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                      gqlClientRequest({
                          gqlQueryPath: queryOptions?.query,
                          gqlQueryParams: queryOptions?.queryParams,
                      }),
              },
          }
        : {};

    const formMutationOptions = mutationOptions
        ? {
              updateMutationOptions: {
                  mutationKey: [mutationOptions?.editResource, mutationOptions?.editQuery],
                  mutationFn: async (): Promise<GetOneResponse<BaseRecord>> => {
                      const { editQuery, editFormAdapter, editQueryParams } = mutationOptions;
                      return gqlClientRequest({
                          gqlQueryPath: editQuery,
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          gqlQueryParams:
                              editFormAdapter?.({
                                  ...(editQueryParams || {}),
                                  ...(form?.getFieldsValue() || {}),
                              }) || {},
                      });
                  },
              },
          }
        : {};

    const formCreateOptions = createOptions
        ? {
              createMutationOptions: {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  mutationKey: [createOptions?.createResource, createOptions?.createQuery],
                  mutationFn: async (): Promise<GetOneResponse<BaseRecord>> => {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      const { createQuery, createFormAdapter, createQueryParams } = createOptions;
                      return gqlClientRequest({
                          gqlQueryPath: createQuery,
                          gqlQueryParams:
                              createFormAdapter?.({
                                  ...(createQueryParams || {}),
                                  ...(form?.getFieldsValue() || {}),
                              }) || {},
                      });
                  },
              },
          }
        : {};

    const { form, formProps, saveButtonProps, query } = useForm({
        ...formQueryOptions,
        ...formMutationOptions,
        ...formCreateOptions,
        defaultFormValues: {},
    });

    const { query: selectQueryResult } = useSelect({
        queryOptions: {
            enabled: true,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            queryKey: [selectOptions?.resource, selectOptions?.queryParams],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            queryFn: async (): Promise<GetOneResponse<BaseRecord>> =>
                gqlClientRequest({
                    gqlQueryPath: selectOptions?.query,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    gqlQueryParams: selectOptions?.queryParams,
                }),
        },
    });

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const formDetails = query?.data?.[queryOptions?.queryResource];
        if (Object.keys(formDetails || {})?.length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            form?.setFieldsValue(queryOptions?.queryFormAdapter?.(formDetails));
        }
    }, [form, query?.data, queryOptions]);

    const isLoading = selectQueryResult?.isLoading || (queryOptions && query?.isLoading);

    return (
        <Edit
            isLoading={isLoading}
            canDelete={false}
            title={title}
            saveButtonProps={saveButtonProps}
        >
            <Form {...formProps} layout="vertical" variant="filled">
                {renderSelectOption?.(selectQueryResult?.data?.[selectOptions?.resource || 0])?.map(
                    (item: ReactNode) => item,
                )}
            </Form>
        </Edit>
    );
}

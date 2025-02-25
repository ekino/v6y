'use client';

import { Edit, useForm, useSelect } from '@refinedev/antd';
import { BaseRecord, GetOneResponse, HttpError } from '@refinedev/core';
import { Form } from 'antd';
import { ReactNode, useEffect } from 'react';

import { gqlClientRequest } from '../../../api';
import { FormWrapperProps, SelectOptionsType } from '../../types';

export default function AdminSelectWrapper<T extends BaseRecord>({
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
                          gqlQueryParams: (editFormAdapter?.({
                              ...(editQueryParams || {}),
                              ...(form?.getFieldsValue() || {}),
                          }) || {}) as Record<string, unknown>,
                      });
                  },
              },
          }
        : {};

    const formCreateOptions = createOptions
        ? {
              createMutationOptions: {
                  mutationKey: [createOptions?.createResource, createOptions?.createQuery],
                  mutationFn: async (): Promise<GetOneResponse<BaseRecord>> => {
                      const { createQuery, createFormAdapter, createQueryParams } = createOptions;
                      return gqlClientRequest({
                          gqlQueryPath: createQuery,
                          gqlQueryParams: (createFormAdapter?.({
                              ...(createQueryParams || {}),
                              ...(form?.getFieldsValue() || {}),
                          }) || {}) as Record<string, unknown>,
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

    const { query: selectQueryResult } = useSelect<T, HttpError, SelectOptionsType>({
        resource: selectOptions?.resource || '',
        queryOptions: {
            enabled: true,
            queryKey: [selectOptions?.resource, selectOptions?.queryParams],
            queryFn: async () =>
                gqlClientRequest({
                    gqlQueryPath: selectOptions?.query,
                    gqlQueryParams: selectOptions?.queryParams,
                }),
        },
    });

    useEffect(() => {
        const data = (query?.data || {}) as BaseRecord;
        const formDetails =
            queryOptions && queryOptions?.queryResource && data
                ? data[queryOptions.queryResource]
                : {};
        if (
            Object.keys(formDetails || {})?.length &&
            queryOptions &&
            queryOptions.queryFormAdapter
        ) {
            form?.setFieldsValue(queryOptions.queryFormAdapter(formDetails));
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

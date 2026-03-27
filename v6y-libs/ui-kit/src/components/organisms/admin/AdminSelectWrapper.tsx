'use client';

import { useForm } from '@refinedev/antd';
import { BaseRecord, GetOneResponse } from '@refinedev/core';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

import { gqlClientRequest } from '../../../api';
import { EditLayout, Form } from '../../atoms';
import { FormWrapperType } from '../../types';

const AdminSelectWrapper = <T extends BaseRecord>({
    title,
    queryOptions,
    mutationOptions,
    createOptions,
    selectOptions,
    renderSelectOption,
}: FormWrapperType) => {
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

    const { data: selectQueryData, isLoading: isSelectQueryLoading } = useQuery({
        enabled: Boolean(selectOptions?.resource && selectOptions?.query),
        queryKey: [selectOptions?.resource, selectOptions?.queryParams],
        queryFn: async () =>
            gqlClientRequest({
                gqlQueryPath: selectOptions?.query,
                gqlQueryParams: selectOptions?.queryParams,
            }),
    });

    const selectData =
        (selectQueryData as Record<string, unknown[]> | undefined)?.[
            selectOptions?.resource || ''
        ] || [];

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

    const isLoading = isSelectQueryLoading || Boolean(queryOptions && query?.isLoading);

    return (
        <EditLayout
            isLoading={isLoading}
            canDelete={false}
            title={title}
            saveButtonProps={saveButtonProps}
        >
            <Form {...formProps} layout="vertical" variant="filled">
                {renderSelectOption?.(selectData as T[])?.map((item: ReactNode) => item)}
            </Form>
        </EditLayout>
    );
};

export default AdminSelectWrapper;

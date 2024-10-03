import { HttpError } from '@refinedev/core';
import { Variables } from 'graphql-request';
import { ReactNode } from 'react';

export interface FormQueryOptionsType {
    resource?: string;
    enabled?: boolean;
    query?: string;
    queryKey?: string[] | unknown[];
    queryParams?: Record<string, unknown>;
    queryResource?: string;
    queryFormAdapter?: (data: unknown) => Record<string, unknown>;
}

export interface FormMutationOptionsType {
    resource?: string;
    editQuery: string;
    editQueryParams?: Record<string, unknown>;
    editFormAdapter?: (data: unknown) => Variables;
}

export interface FormCreateOptionsType {
    title: string | ReactNode;
    createOptions: {
        createQuery: string;
        createFormAdapter?: (data: unknown) => Variables;
        createQueryParams?: Record<string, unknown>;
    };
    formItems: ReactNode[];
}

export interface FormWrapperProps {
    title?: string | ReactNode;
    queryOptions?: FormQueryOptionsType;
    mutationOptions?: FormMutationOptionsType;
    formItems?: ReactNode[];
    selectOptions?: {
        resource: string;
        query: string;
    };
    renderSelectOption?: (options: unknown) => ReactNode[];
}

export interface FormShowOptions {
    title?: string | ReactNode;
    formItems?: ReactNode[];
    queryOptions?: {
        resource?: string;
        enabled?: boolean;
        queryParams?: Record<string, unknown>;
        query?: string;
        queryResource?: string;
    };
    renderShowView?: ({
        data,
        error,
    }: {
        data?: unknown;
        error: HttpError | string | undefined;
    }) => ReactNode;
}

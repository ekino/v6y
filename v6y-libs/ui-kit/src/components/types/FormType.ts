import { Variables } from 'graphql-request';
import { ReactNode } from 'react';

import { AdminHttpError } from '../../api/types/AdminHttpError';

export interface FormQueryOptionsType {
    resource?: string;
    enabled?: boolean;
    query?: string;
    queryKey?: string[] | unknown[];
    queryParams?: Record<string, unknown>;
    queryResource?: string;
    queryFormAdapter?: (data: Record<string, unknown>) => Record<string, unknown>;
}

export interface FormMutationOptionsType {
    resource?: string;
    editResource?: string;
    editQuery: string;
    editQueryParams?: Record<string, unknown>;
    editFormAdapter?: (data: Record<string, string>) => Variables;
}

export interface FormCreateOptionsType {
    createResource?: string;
    createQuery?: string;
    createFormAdapter?: (data: Record<string, string>) => Variables;
    createQueryParams?: Record<string, unknown>;
}

export interface FormShowOptions {
    title?: string | ReactNode;
    formItems?: ReactNode[];
    queryOptions?: FormQueryOptionsType;
    renderShowView?: <T>({ data, error }: { data?: T; error?: AdminHttpError }) => ReactNode;
}

export interface FormCreateWrapperType {
    title: string | ReactNode;
    createOptions: FormCreateOptionsType;
    formItems: ReactNode[];
}

export interface SelectOptionsType {
    resource: string;
}

export interface FormWrapperType {
    title?: string | ReactNode;
    queryOptions?: FormQueryOptionsType;
    mutationOptions?: FormMutationOptionsType;
    createOptions?: FormCreateOptionsType;
    formItems?: ReactNode[];
    selectOptions?: {
        resource: string;
        query: string;
        queryParams?: Record<string, unknown>;
    };
    renderSelectOption?: <T>(options: T) => ReactNode[];
}

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';

import {
    BuildClientQueryParams,
    UseClientQueryParams,
    UseInfiniteClientQueryParams,
} from './QueryAdapterType';
import { getAuthToken } from '../../../commons/hooks/useAuth';

export const buildClientQuery = async <TData = unknown,>({
    queryBaseUrl,
    query,
    variables,
}: BuildClientQueryParams) => {
    const token = getAuthToken();

    return request<TData>(queryBaseUrl, query, variables, {
        Authorization: token ? `Bearer ${token}` : '',
    });
};

export const useClientQuery = <TData = unknown,>({
    queryCacheKey,
    queryBuilder,
}: UseClientQueryParams<TData>) => {
    return useQuery<TData, Error>({ queryKey: queryCacheKey, queryFn: queryBuilder });
};

export const useInfiniteClientQuery = <TData = unknown,>({
    queryCacheKey,
    queryBuilder,
    getNextPageParam,
}: UseInfiniteClientQueryParams<TData>) => {
    return useInfiniteQuery<TData, Error>({
        initialData: undefined,
        initialPageParam: undefined,
        queryKey: queryCacheKey,
        queryFn: queryBuilder,
        getNextPageParam: getNextPageParam ? getNextPageParam : () => {},
    });
};

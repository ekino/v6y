import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';
import Cookies from 'js-cookie';

import {
    BuildClientQueryParams,
    UseClientQueryParams,
    UseInfiniteClientQueryParams,
} from './QueryAdapterType';

export const buildClientQuery = async <TData = unknown,>({
    queryBaseUrl,
    query,
    variables,
}: BuildClientQueryParams) => {
    const auth = Cookies.get('auth');
    const token = auth ? JSON.parse(auth).token : '';

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

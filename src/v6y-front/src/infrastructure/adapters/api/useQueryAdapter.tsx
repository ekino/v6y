import {
    BuildClientQueryParams,
    UseClientQueryParams,
    UseInfiniteClientQueryParams,
} from '@/infrastructure/adapters/api/QueryAdapterType';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';

export const buildClientQuery = async <TData = unknown,>({
    queryBaseUrl,
    query,
    variables,
}: BuildClientQueryParams) => {
    return request<TData>(queryBaseUrl, query, variables);
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

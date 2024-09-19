import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import GraphqlClientRequest from 'graphql-request';

export const buildClientQuery = async ({ queryBaseUrl, queryPath, queryParams }) =>
    GraphqlClientRequest(queryBaseUrl, queryPath, queryParams);

export const useClientQuery = ({ queryCacheKey, queryBuilder }) => {
    return useQuery({
        queryKey: queryCacheKey,
        queryFn: queryBuilder,
    });
};

export const useInfiniteClientQuery = ({ queryCacheKey, queryBuilder, nextPageParamBuilder }) => {
    return useInfiniteQuery({
        queryKey: queryCacheKey,
        queryFn: queryBuilder,
        getNextPageParam: nextPageParamBuilder,
    });
};

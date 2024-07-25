import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import GraphqlClientRequest from 'graphql-request';
import VitalityConfig from '../config/VitalityConfig.js';

export const buildGraphqlQuery = async ({ query, queryParams }) =>
    GraphqlClientRequest(VitalityConfig.VITALITY_BFF_URL, query, queryParams);

export const useGraphqlClient = ({ queryKey, queryFn }) => {
    return useQuery({
        queryKey,
        queryFn,
    });
};

export const useInfiniteGraphqlClient = ({ queryKey, queryFn, getNextPageParam }) => {
    return useInfiniteQuery({
        queryKey,
        queryFn,
        getNextPageParam,
    });
};

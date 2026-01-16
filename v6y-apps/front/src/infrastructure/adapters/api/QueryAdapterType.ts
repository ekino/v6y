import { Variables } from 'graphql-request';

export interface BuildClientQueryParams {
    queryBaseUrl: string;
    query: string;
    variables?: Variables;
}

export interface UseClientQueryParams<TData> {
    queryCacheKey: string[];
    queryBuilder: () => Promise<TData>;
    variables?: Variables;
}

export interface UseInfiniteClientQueryParams<TData> extends UseClientQueryParams<TData> {
    getNextPageParam?: (lastPage: TData, allPages: TData[]) => unknown;
}

export interface UseClientMutationParams<TData> {
    mutationKey: string[];
    mutationBuilder: () => Promise<TData>;
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
}

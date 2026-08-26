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

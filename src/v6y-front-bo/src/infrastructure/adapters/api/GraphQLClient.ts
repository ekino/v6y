import { GraphQLClient } from 'graphql-request';
import Cookies from 'js-cookie';

export const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GQL_API_BASE_PATH as string, {
    fetch: (url: RequestInfo | URL, options?: RequestInit) => {
        return fetch(url, {
            ...options,
            headers: {
                ...(options?.headers || {}),
                Authorization: `Bearer ${JSON.parse(Cookies.get('auth') || '{}')?.token}`,
            },
        });
    },
});

type GqlClientRequestParams = {
    gqlQueryPath?: string;
    gqlQueryParams?: Record<string, unknown>;
};

export const gqlClientRequest = <T>({
    gqlQueryPath,
    gqlQueryParams,
}: GqlClientRequestParams): Promise<T> => gqlClient.request(gqlQueryPath, gqlQueryParams);

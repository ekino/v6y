import { GraphQLClient, RequestDocument } from 'graphql-request';
import Cookie from 'js-cookie';

export const gqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_V6Y_BFF_PATH as string, {
    fetch: (url: RequestInfo | URL, options?: RequestInit) => {
        return fetch(url, {
            ...options,
            headers: {
                ...(options?.headers || {}),
                Authorization: `Bearer ${JSON.parse(Cookie.get('auth') || '{}')?.token}`,
            },
        });
    },
});

type GqlClientRequestParams = {
    gqlQueryPath?: RequestDocument;
    gqlQueryParams?: Record<string, unknown>;
};

export const gqlClientRequest = <T>({
    gqlQueryPath,
    gqlQueryParams,
}: GqlClientRequestParams): Promise<T> =>
    gqlQueryPath ? gqlClient.request(gqlQueryPath, gqlQueryParams) : Promise.resolve({} as T);

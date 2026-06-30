import { GraphQLClient, RequestDocument } from 'graphql-request';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Cookie from 'js-cookie';

const resolveGraphQLUrl = (graphQLUrl: string) => {
    if (/^https?:\/\//i.test(graphQLUrl)) {
        return graphQLUrl;
    }

    const baseOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    return new URL(graphQLUrl, baseOrigin).toString();
};

export const gqlClient = new GraphQLClient(
    resolveGraphQLUrl(process.env.NEXT_PUBLIC_V6Y_BFF_PATH as string),
    {
        fetch: (url: RequestInfo | URL, options?: RequestInit) => {
            return fetch(url, {
                ...options,
                headers: {
                    ...(options?.headers || {}),
                    'content-type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(Cookie.get('auth') || '{}')?.token}`,
                },
            });
        },
    },
);

type GqlClientRequestParams = {
    gqlQueryPath?: RequestDocument;
    gqlQueryParams?: Record<string, unknown>;
};

export const gqlClientRequest = <T>({
    gqlQueryPath,
    gqlQueryParams,
}: GqlClientRequestParams): Promise<T> =>
    gqlQueryPath ? gqlClient.request(gqlQueryPath, gqlQueryParams) : Promise.resolve({} as T);

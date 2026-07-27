import { GraphQLClient, RequestDocument } from 'graphql-request';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Cookie from 'js-cookie';

const resolveGraphQLUrl = (graphQLUrl: string) => {
    if (!graphQLUrl?.length) {
        throw new Error(
            '[GraphQLClient] NEXT_PUBLIC_V6Y_BFF_PATH is not configured; unable to resolve the BFF GraphQL endpoint.',
        );
    }

    if (/^https?:\/\//i.test(graphQLUrl)) {
        return graphQLUrl;
    }

    const baseOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    return new URL(graphQLUrl, baseOrigin).toString();
};

export const gqlClient = new GraphQLClient('', {
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
});

// Resolving the BFF URL can throw (e.g. NEXT_PUBLIC_V6Y_BFF_PATH not configured).
// Defer that resolution until the client is actually used instead of at module
// import time, so merely importing this module never crashes the whole app.
let resolvedBaseUrl: string | null = null;

const ensureGqlClientUrl = () => {
    if (resolvedBaseUrl === null) {
        resolvedBaseUrl = resolveGraphQLUrl(process.env.NEXT_PUBLIC_V6Y_BFF_PATH as string);
        gqlClient.setEndpoint(resolvedBaseUrl);
    }
};

type GqlClientRequestParams = {
    gqlQueryPath?: RequestDocument;
    gqlQueryParams?: Record<string, unknown>;
};

export const gqlClientRequest = <T>({
    gqlQueryPath,
    gqlQueryParams,
}: GqlClientRequestParams): Promise<T> => {
    if (!gqlQueryPath) {
        return Promise.resolve({} as T);
    }

    ensureGqlClientUrl();
    return gqlClient.request(gqlQueryPath, gqlQueryParams);
};

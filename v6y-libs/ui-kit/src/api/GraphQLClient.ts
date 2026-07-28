import { GraphQLClient, RequestDocument } from 'graphql-request';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Cookie from 'js-cookie';

/**
 * NEXT_PUBLIC_V6Y_BFF_PATH is the browser-facing GraphQL endpoint. It may be an
 * absolute URL, or a path relative to the origin serving the app (which is how the
 * `front` app reaches the BFF, through its own rewrite).
 */
const resolveGraphQLUrl = (graphQLUrl?: string) => {
    if (!graphQLUrl?.length) {
        throw new Error(
            '[GraphQLClient] NEXT_PUBLIC_V6Y_BFF_PATH is not configured; unable to resolve the BFF GraphQL endpoint.',
        );
    }

    if (/^https?:\/\//i.test(graphQLUrl)) {
        return graphQLUrl;
    }

    // A relative path is only meaningful against the browser origin. Assuming a
    // server origin used to silently send requests to localhost:3000, so a relative
    // value outside the browser is surfaced as the misconfiguration it is.
    if (typeof window === 'undefined') {
        throw new Error(
            `[GraphQLClient] NEXT_PUBLIC_V6Y_BFF_PATH must be an absolute URL to be usable outside the browser; received "${graphQLUrl}".`,
        );
    }

    return new URL(graphQLUrl, window.location.origin).toString();
};

let client: GraphQLClient | undefined;

/**
 * Built on first use rather than at import time: resolving the endpoint can throw,
 * and throwing while the module is evaluated would take down every page that
 * transitively imports it instead of only the request that needs the BFF.
 */
export const getGqlClient = () => {
    if (!client) {
        client = new GraphQLClient(resolveGraphQLUrl(process.env.NEXT_PUBLIC_V6Y_BFF_PATH), {
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
    }

    return client;
};

type GqlClientRequestParams = {
    gqlQueryPath?: RequestDocument;
    gqlQueryParams?: Record<string, unknown>;
};

export const gqlClientRequest = <T>({
    gqlQueryPath,
    gqlQueryParams,
}: GqlClientRequestParams): Promise<T> =>
    gqlQueryPath ? getGqlClient().request(gqlQueryPath, gqlQueryParams) : Promise.resolve({} as T);

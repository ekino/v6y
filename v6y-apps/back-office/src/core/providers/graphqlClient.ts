'use client';

import { GraphQLClient } from 'graphql-request';
import Cookie from 'js-cookie';

export interface StoredAuth {
    token: string;
    _id: number | string;
    role: string;
}

export const getStoredAuth = (): StoredAuth | undefined => {
    const raw = Cookie.get('auth');
    if (!raw) {
        return undefined;
    }
    try {
        return JSON.parse(raw) as StoredAuth;
    } catch {
        return undefined;
    }
};

/**
 * Builds a GraphQLClient authenticated with the JWT stored in the `auth` cookie
 * (see authProvider.ts). The BFF rejects every operation (except LoginAccount /
 * IntrospectionQuery) without a valid `Authorization: Bearer <token>` header.
 */
export const createAuthenticatedGraphQLClient = (): GraphQLClient => {
    const bffPath = process.env.NEXT_PUBLIC_V6Y_BFF_PATH as string;
    const auth = getStoredAuth();

    return new GraphQLClient(bffPath, {
        headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
    });
};

/* eslint-disable max-lines-per-function */
// tests.ts
import { Mock, describe, expect, it, vi } from 'vitest';

import AccountProvider from '../../database/AccountProvider.ts';
import {
    createJwtOptions,
    generateAuthenticationToken,
    isAdmin,
    isSuperAdmin,
    validateCredentials,
} from '../AuthenticationHelper.ts';

vi.mock('../../database/AccountProvider.ts', async () => {
    const actualModule = (await vi.importActual(
        '../../database/AccountProvider.ts',
    )) as typeof import('../../database/AccountProvider.ts');

    return {
        default: {
            ...actualModule.default,
            getAccountDetailsByParams: vi.fn(),
        },
    };
});

describe('AuthenticationHelper', () => {
    it('should create jwt options', () => {
        const result = createJwtOptions();
        expect(result).toEqual({
            jwtFromRequest: expect.any(Function),
            secretOrKey: expect.any(String),
        });
    });

    it('should generate token', () => {
        const account = { _id: 12 };
        const result = generateAuthenticationToken(account);

        expect(result).toEqual(expect.any(String));
    });

    it('should return null if token is invalid', async () => {
        const account = {};
        const token = generateAuthenticationToken(account);

        const request = {
            cache: 'default' as RequestCache,
            credentials: 'same-origin',
            destination: '',
            integrity: '',
            keepalive: false,
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            referrer: '',
            referrerPolicy: '',
            headers: {
                authorization: `Bearer ${token}`,
            },
            url: '',
            clone: () => request,
            body: null,
            bodyUsed: false,
            context: '',
            signal: new AbortController().signal,
            arrayBuffer: async () => new ArrayBuffer(0),
            blob: async () => new Blob(),
            formData: async () => new FormData(),
            json: async () => ({}),
            text: async () => '',
        } as unknown as Request;

        const result = await validateCredentials(request);
        expect(result).toBe(null);
    });

    it('should authenticate with passport', async () => {
        (AccountProvider.getAccountDetailsByParams as Mock).mockReturnValue({
            _id: 15,
            email: 'superadmin@superadmin.superadmin',
            role: 'ADMIN',
            applications: [1, 2, 3],
        });

        const account = {
            _id: 15,
            email: 'superadmin@superadmin.superadmin',
            role: 'ADMIN',
            applications: [1, 2, 3],
        };
        const token = generateAuthenticationToken(account);
        const request = {
            cache: 'default' as RequestCache,
            credentials: 'same-origin',
            destination: '',
            integrity: '',
            keepalive: false,
            method: 'GET',
            mode: 'cors',
            redirect: 'follow',
            referrer: '',
            referrerPolicy: '',
            headers: {
                authorization: `Bearer ${token}`,
            },
            url: '',
            clone: () => request,
            body: null,
            bodyUsed: false,
            context: '',
            signal: new AbortController().signal,
            arrayBuffer: async () => new ArrayBuffer(0),
            blob: async () => new Blob(),
            formData: async () => new FormData(),
            json: async () => ({}),
            text: async () => '',
        } as unknown as Request;

        const result = await validateCredentials(request);

        expect(result).toEqual(account);
    });

    it('should return true if the user is ADMIN, false otherwise', () => {
        const accountAdmin = {
            _id: 15,
            email: 'admin@admin.admin',
            role: 'ADMIN',
            applications: [1, 2, 3],
        };

        const accountSuperAdmin = {
            _id: 15,
            email: 'superadmin@superadmin.superadmin',
            role: 'SUPERADMIN',
            applications: [1, 2, 3],
        };

        const accountUser = {
            _id: 15,
            email: 'user@user.user',
            role: 'USER',
            applications: [1, 2, 3],
        };

        expect(isAdmin(accountAdmin)).toBe(true);
        expect(isAdmin(accountSuperAdmin)).toBe(false);
        expect(isAdmin(accountUser)).toBe(false);
    });

    it('should return true if the user is SUPERADMIN, false otherwise', () => {
        const accountAdmin = {
            _id: 15,
            email: 'admin@admin.admin',
            role: 'ADMIN',
            applications: [1, 2, 3],
        };

        const accountSuperAdmin = {
            _id: 15,
            email: 'superadmin@superadmin.superadmin',
            role: 'SUPERADMIN',
            applications: [1, 2, 3],
        };

        const accountUser = {
            _id: 15,
            email: 'user@user.user',
            role: 'USER',
            applications: [1, 2, 3],
        };

        expect(isSuperAdmin(accountAdmin)).toBe(false);
        expect(isSuperAdmin(accountSuperAdmin)).toBe(true);
        expect(isSuperAdmin(accountUser)).toBe(false);
    });
});

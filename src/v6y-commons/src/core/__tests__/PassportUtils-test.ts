// PassportUtils.tests.ts
import { Mock, describe, expect, it, vi } from 'vitest';

import AccountProvider from '../../database/AccountProvider.ts';
import * as PassportUtils from '../PassportUtils.ts';

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

describe('PassportUtils', () => {
    it('should create jwt options', () => {
        const result = PassportUtils.createJwtOptions();
        expect(result).toEqual({
            jwtFromRequest: expect.any(Function),
            secretOrKey: expect.any(String),
        });
    });

    it('should generate token', () => {
        const account = { _id: 12 };
        const result = PassportUtils.passportGenerateToken(account);

        expect(result).toEqual(expect.any(String));
    });

    it('should return null if token is invalid', async () => {
        const account = {};
        const token = PassportUtils.passportGenerateToken(account);

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

        const result = await PassportUtils.passportAuthenticate(request);
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
        const token = PassportUtils.passportGenerateToken(account);
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

        const result = await PassportUtils.passportAuthenticate(request);

        expect(result).toEqual(account);
    });
});

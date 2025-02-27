import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Mock, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
    createJwtOptions,
    createJwtStrategyVerify,
    generateAuthenticationToken,
    isAdmin,
    isSuperAdmin,
    validateCredentials,
} from '../core/AuthenticationHelper.ts';
import AccountProvider from '../database/AccountProvider.ts';

const { getAccountDetailsByParams } = AccountProvider;

beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret'; // Ensure JWT_SECRET is set
});

beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret'; // Ensure it persists across tests
});

vi.mock('../database/AccountProvider.ts', async () => {
    return {
        __esModule: true, // Ensure it's treated as an ES module
        default: {
            getAccountDetailsByParams: vi.fn().mockResolvedValue({
                _id: 123,
                email: 'test@example.com',
                role: 'USER',
            }),
        },
    };
});

vi.mock('../core/AppLogger.ts', () => ({
    __esModule: true,
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('jsonwebtoken');
vi.mock('passport');

const mockAccount = { _id: 123, email: 'test@example.com', role: 'USER' };

describe('Authentication Helper', () => {
    it('should create JWT options correctly', () => {
        expect(createJwtOptions()).toEqual({
            jwtFromRequest: expect.any(Function),
            secretOrKey: 'test_secret',
        });
    });

    it('should generate a JWT token', () => {
        process.env.JWT_SECRET = 'test_secret'; // Ensure it exists
        (jwt.sign as Mock).mockReturnValue('mocked_token');

        expect(generateAuthenticationToken(mockAccount)).toBe('mocked_token');
        expect(jwt.sign).toHaveBeenCalledWith(
            { _id: 123, email: 'test@example.com' },
            'test_secret',
        );
    });

    it('should verify JWT and return user details', async () => {
        (getAccountDetailsByParams as Mock).mockResolvedValue(mockAccount);
        const verifyFn = createJwtStrategyVerify();

        const done = vi.fn();
        await verifyFn({ _id: 123 }, done);

        expect(done).toHaveBeenCalledWith(null, mockAccount);
    });

    it('should fail verification if user is not found', async () => {
        (getAccountDetailsByParams as Mock).mockResolvedValue(null);
        const verifyFn = createJwtStrategyVerify();

        const done = vi.fn();
        await verifyFn({ _id: 999 }, done);

        expect(done).toHaveBeenCalledWith(Error('User not Found'), undefined);
    });

    it('should fail verification if JWT payload lacks _id', async () => {
        const verifyFn = createJwtStrategyVerify();
        const done = vi.fn();
        await verifyFn({}, done);
        expect(done).toHaveBeenCalledWith(Error('Token does not contain _id'), undefined);
    });

    it('should validate credentials using Passport', async () => {
        const request = {};
        const user = { _id: 123 };
        (passport.authenticate as Mock).mockImplementation((_, __, cb) => cb(null, user));

        const result = await validateCredentials(request);
        expect(result).toEqual(user);
    });

    it('should return null if authentication fails', async () => {
        const request = {};
        (passport.authenticate as Mock).mockImplementation((_, __, cb) =>
            cb(new Error('Error'), null),
        );

        const result = await validateCredentials(request);
        expect(result).toBeNull();
    });

    it('should check if a user is an admin', () => {
        expect(isAdmin({ role: 'ADMIN' })).toBe(true);
        expect(isAdmin({ role: 'USER' })).toBe(false);
    });

    it('should check if a user is a superadmin', () => {
        expect(isSuperAdmin({ role: 'SUPERADMIN' })).toBe(true);
        expect(isSuperAdmin({ role: 'ADMIN' })).toBe(false);
    });
});

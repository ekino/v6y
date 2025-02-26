import passport from 'passport';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import AppLogger from '../core/AppLogger.ts';
import {
    configureAuthenticationStrategy,
    createJwtStrategyVerify,
    generateAuthenticationToken,
    isAdmin,
    isSuperAdmin,
    validateCredentials,
} from '../core/AuthenticationHelper.ts';
import AccountProvider from '../database/AccountProvider.ts';
import { AccountType } from '../types/AccountType.ts';

vi.mock('jsonwebtoken');
vi.mock('passport');
vi.mock('../../database/AccountProvider.ts', () => ({
    default: {
        getAccountDetailsByParams: vi.fn(),
    },
}));
vi.mock('../AppLogger.ts');

describe('AuthenticationHelper', () => {
    const mockAccount: AccountType = {
        _id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        role: 'USER',
        applications: [1],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        delete process.env.JWT_SECRET;
    });

    it('should verify JWT payload and return account details', async () => {
        const jwtPayload = { _id: 1 };
        (AccountProvider.getAccountDetailsByParams as Mock).mockResolvedValue(mockAccount);
        const verify = createJwtStrategyVerify();
        const done = vi.fn();
        await verify(jwtPayload, done);
        expect(AccountProvider.getAccountDetailsByParams).toHaveBeenCalledWith({ _id: 1 });
        expect(done).toHaveBeenCalledWith(null, mockAccount);
    });

    it('should return error if token does not contain _id', async () => {
        const jwtPayload = {};
        const verify = createJwtStrategyVerify();
        const done = vi.fn();
        await verify(jwtPayload, done);
        expect(done).toHaveBeenCalledWith(Error('Token does not contain _id'), undefined);
    });

    it('should return error if user is not found', async () => {
        const jwtPayload = { _id: 1 };
        (AccountProvider.getAccountDetailsByParams as Mock).mockResolvedValue(null);
        const verify = createJwtStrategyVerify();
        const done = vi.fn();
        await verify(jwtPayload, done);
        expect(AccountProvider.getAccountDetailsByParams).toHaveBeenCalledWith({ _id: 1 });
        expect(done).toHaveBeenCalledWith(Error('User not Found'), undefined);
    });

    it('should handle errors during verification', async () => {
        const jwtPayload = { _id: 1 };
        (AccountProvider.getAccountDetailsByParams as Mock).mockRejectedValue(
            new Error('DB error'),
        );
        const verify = createJwtStrategyVerify();
        const done = vi.fn();
        await verify(jwtPayload, done);
        expect(done).toHaveBeenCalledWith(Error('DB error'), undefined);
        expect(AppLogger.error).toHaveBeenCalledWith(
            '[AuthenticationHelper- createJwtStrategyVerify] : Error: DB error',
        );
    });

    it('should authenticate user and resolve with user details', async () => {
        const request = {};
        (passport.authenticate as Mock).mockImplementation((strategy, options, callback) => {
            callback(null, mockAccount);
        });
        const user = await validateCredentials(request);
        expect(passport.authenticate).toHaveBeenCalledWith(
            'jwt',
            { session: false },
            expect.any(Function),
        );
        expect(user).toEqual(mockAccount);
    });

    it('should resolve with null if authentication fails', async () => {
        const request = {};
        (passport.authenticate as Mock).mockImplementation((strategy, options, callback) => {
            callback(new Error('Authentication failed'), null);
        });
        const user = await validateCredentials(request);
        expect(passport.authenticate).toHaveBeenCalledWith(
            'jwt',
            { session: false },
            expect.any(Function),
        );
        expect(user).toEqual(null);
        expect(AppLogger.error).toHaveBeenCalledWith(
            '[AuthenticationHelper - validateCredentials] Not authenticated : Error: Authentication failed',
        );
    });

    it('should return true if user role is ADMIN', () => {
        expect(isAdmin({ ...mockAccount, role: 'ADMIN' })).toBe(true);
    });

    it('should return false if user role is not ADMIN', () => {
        expect(isAdmin(mockAccount)).toBe(false);
    });

    it('should return true if user role is SUPERADMIN', () => {
        expect(isSuperAdmin({ ...mockAccount, role: 'SUPERADMIN' })).toBe(true);
    });

    it('should return false if user role is not SUPERADMIN', () => {
        expect(isSuperAdmin(mockAccount)).toBe(false);
    });

    it('should configure JWT strategy', () => {
        process.env.JWT_SECRET = 'test_secret';
        configureAuthenticationStrategy();
        expect(passport.use).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should configure JWT strategy', () => {
        process.env.JWT_SECRET = 'test_secret';
        configureAuthenticationStrategy();
        expect(passport.use).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw an error when generating a JWT token if JWT_SECRET is undefined', () => {
        delete process.env.JWT_SECRET;
        const account = { _id: 1, email: 'test@example.com' };
        expect(() => generateAuthenticationToken(account)).toThrow(
            '[AuthenticationHelper - generateAuthenticationToken] JWT_SECRET is not defined in the environment variables',
        );
    });

    it('should correctly initialize passport middleware', () => {
        const middleware = passport.initialize();
        expect(passport.initialize).toHaveBeenCalled();
        expect(middleware).toBe(passport.initialize());
    });

    it('should call AppLogger when an error occurs during JWT strategy verification', async () => {
        const jwtPayload = { _id: 1 };
        (AccountProvider.getAccountDetailsByParams as Mock).mockRejectedValue(
            new Error('Unexpected error'),
        );

        const verify = createJwtStrategyVerify();
        const done = vi.fn();
        await verify(jwtPayload, done);

        expect(AppLogger.error).toHaveBeenCalledWith(
            '[AuthenticationHelper- createJwtStrategyVerify] : Error: Unexpected error',
        );
        expect(done).toHaveBeenCalledWith(Error('Unexpected error'), undefined);
    });

    it('should log user information during successful JWT strategy verification', async () => {
        const jwtPayload = { _id: 1 };
        (AccountProvider.getAccountDetailsByParams as Mock).mockResolvedValue(mockAccount);

        const verify = createJwtStrategyVerify();
        const done = vi.fn();
        await verify(jwtPayload, done);

        expect(AppLogger.info).toHaveBeenCalledWith(
            '[AuthenticationHelper - createJwtStrategyVerify] _id : 1',
        );
    });

    it('should log an error if no strategy is configured during authentication', () => {
        process.env.JWT_SECRET = 'test_secret';

        (passport.use as Mock).mockImplementation(() => {
            throw new Error('No strategy configured');
        });

        configureAuthenticationStrategy();

        expect(AppLogger.error).toHaveBeenCalledWith(
            '[AuthenticationHelper - validateCredentials] Not authenticated : Error: No strategy configured',
        );
    });
});

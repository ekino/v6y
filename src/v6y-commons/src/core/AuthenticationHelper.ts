// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { VerifiedCallback } from 'passport-jwt';

import AccountProvider from '../database/AccountProvider.ts';
import { AccountType } from '../types/AccountType.ts';
import AppLogger from './AppLogger.ts';

/**
 * Creates options for JWT strategy.
 * @returns {Object} Configuration options for passport JWT strategy.
 * @throws {Error} If the `JWT_SECRET` is not defined in environment variables.
 */
export const createJwtOptions = () => {
    const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

    if (SECRET_KEY === undefined) {
        throw new Error(
            '[AuthenticationHelper - createJwtOptions] JWT_SECRET is not defined in the environment variables',
        );
    }

    return {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_KEY,
    };
};

/**
 * Creates a verification function for JWT strategy.
 * @returns {Function} A function that verifies JWT payload.
 */
export const createJwtStrategyVerify = () => {
    const { JwtPayload } = jwt;
    return async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
        try {
            AppLogger.info(
                `[AuthenticationHelper - createJwtStrategyVerify] JwtPayload: ${JwtPayload?._id}`,
            );

            // Ensure the token contains the `_id` field.
            if (!jwtPayload._id) {
                return done(Error('Token does not contain _id'), undefined);
            }

            const accountDetails = await AccountProvider.getAccountDetailsByParams({
                _id: jwtPayload._id,
            });

            AppLogger.info(
                `[AuthenticationHelper - createJwtStrategyVerify] _id : ${accountDetails?._id}`,
            );

            if (!accountDetails) {
                return done(Error('User not Found'), undefined);
            }

            AppLogger.info(
                `[AuthenticationHelper - createJwtStrategyVerify] User Found : ${accountDetails._id}`,
            );

            return done(null, accountDetails);
        } catch (error) {
            AppLogger.error(`[AuthenticationHelper- createJwtStrategyVerify] : ${error}`);
            return done(error, undefined);
        }
    };
};

/**
 * Generates a JWT for the given account.
 * @param {AccountType} account - The account object containing `_id` and `email`.
 * @returns {string} The generated JWT token.
 * @throws {Error} If the `JWT_SECRET` is not defined in environment variables.
 */
export const generateAuthenticationToken = (account: AccountType): string => {
    const SECRET_KEY = process.env.JWT_SECRET;

    if (SECRET_KEY === undefined) {
        throw new Error(
            '[AuthenticationHelper - generateAuthenticationToken] JWT_SECRET is not defined in the environment variables',
        );
    }

    return jwt.sign({ _id: account._id, email: account.email }, SECRET_KEY);
};

/**
 * Authenticates a request using Passport and JWT.
 * @param {any} request - The incoming HTTP request.
 * @returns {Promise<unknown>} A promise resolving to the authenticated user or null.
 */
export const validateCredentials = <T>(request: T): Promise<unknown> => {
    return new Promise((resolve) => {
        passport.authenticate('jwt', { session: false }, (err: Error | null, user: unknown) => {
            if (err || !user) {
                AppLogger.error(
                    `[AuthenticationHelper - validateCredentials] Not authenticated : ${err || 'No user found'}`,
                );
                resolve(null);
            } else {
                resolve(user);
            }
        })(request);
    });
};

/**
 * Initializes Authentication middleware.
 */
export const configureAuthMiddleware = <T>(): T => passport.initialize() as T;

/**
 * Check if user role is ADMIN.
 * @param {object} account
 * @returns {boolean}
 */
export const isAdmin = (account: AccountType) => account?.role === 'ADMIN';

/**
 * Check if user role is SUPERADMIN.
 * @param {object} account
 * @returns {boolean}
 */
export const isSuperAdmin = (account: AccountType) => account?.role === 'SUPERADMIN';

/**
 * Configures the authentication strategy.
 */
export const configureAuthenticationStrategy = () => {
    try {
        const jwtAuthenticationStrategy = new JwtStrategy(
            createJwtOptions(),
            createJwtStrategyVerify(),
        );
        passport.use(jwtAuthenticationStrategy);
    } catch (error) {
        AppLogger.error(
            `[AuthenticationHelper - validateCredentials] Not authenticated : ${error || 'No user found'}`,
        );
    }
};

configureAuthenticationStrategy();

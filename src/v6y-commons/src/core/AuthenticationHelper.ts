import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
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
const createJwtStrategyVerify = () => {
    return async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
        try {
            // Ensure the token contains the `_id` field.
            if (!jwtPayload._id) {
                return done(Error('Token does not contain _id'), undefined);
            }

            const accountDetails = await AccountProvider.getAccountDetailsByParams({
                _id: jwtPayload._id,
            });

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
 * Initializes JWT strategy for Passport.
 */
passport.use(new JwtStrategy(createJwtOptions(), createJwtStrategyVerify()));

/**
 * Initializes Authentication middleware.
 */
export const configureAuthMiddleware = <T>(): T => passport.initialize() as T;

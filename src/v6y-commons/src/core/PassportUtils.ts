import jwt from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import AccountProvider from '../database/AccountProvider.ts';
import { AccountType } from '../types/AccountType.ts';
import AppLogger from './AppLogger.ts';

const SECRET_KEY = process.env.JWT_SECRET || 'temporaryToken'; // TODO: Remove this static tokens

if (SECRET_KEY === undefined) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY,
};

passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            if (!jwtPayload._id) {
                return done(null, false);
            }

            const accountDetails = await AccountProvider.getAccountDetailsByParams({
                _id: jwtPayload._id,
            });

            if (accountDetails) {
                return done(null, accountDetails);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }),
);

export const passportAuthenticate = (request: Request) =>
    new Promise((resolve) => {
        passport.authenticate('jwt', { session: false }, (err: Error | null, user: unknown) => {
            if (err || !user) {
                AppLogger.info(`[ApolloServer] Not authenticated : ${err || 'No user found'}`);
                resolve(null);
            } else {
                resolve(user);
            }
        })(request);
    });

export const passportGenerateToken = (account: AccountType) => {
    return jwt.sign({ _id: account._id, email: account.email }, SECRET_KEY);
};

export const passportInitialize = () => passport.initialize();

export const isAdmin = (account: AccountType) => account?.role === 'ADMIN';

export const isSuperAdmin = (account: AccountType) => account?.role === 'SUPERADMIN';

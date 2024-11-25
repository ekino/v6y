import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { VerifiedCallback } from 'passport-jwt';

import AccountProvider from '../database/AccountProvider.ts';
import { AccountType } from '../types/AccountType.ts';
import AppLogger from './AppLogger.ts';

export const createJwtOptions = () => {
    const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

    if (SECRET_KEY === undefined) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    return {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_KEY,
    };
};

const createJwtStrategyVerify = () => {
    return async (jwtPayload: JwtPayload, done: VerifiedCallback) => {
        try {
            // Vérifier si le token contient bien un _id ou email
            if (!jwtPayload._id) {
                return done(null, false);
            }

            const accountDetails = await AccountProvider.getAccountDetailsByParams({
                _id: jwtPayload._id,
            });

            if (accountDetails) {
                AppLogger.info(`[passport] Utilisateur trouvé : ${accountDetails._id}`);
                return done(null, accountDetails);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    };
};

passport.use(new JwtStrategy(createJwtOptions(), createJwtStrategyVerify()));

export const passportAuthenticate = (request: Request): Promise<unknown> => {
    return new Promise((resolve) => {
        passport.authenticate('jwt', { session: false }, (err: Error | null, user: unknown) => {
            if (err || !user) {
                AppLogger.info(`[ApolloServer] Not authenticated : ${err || 'No user found'}`);
                resolve(null);
            } else {
                resolve(user);
            }
        })(request);
    });
};

export const passportGenerateToken = (account: AccountType) => {
    const SECRET_KEY = process.env.JWT_SECRET;

    if (SECRET_KEY === undefined) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    return jwt.sign({ _id: account._id, email: account.email }, SECRET_KEY);
};

export const passportInitialize = () => passport.initialize();

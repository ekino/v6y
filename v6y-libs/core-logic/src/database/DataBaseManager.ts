import { OperatorsAliases, Sequelize } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { hashPassword } from '../core/PasswordUtils.ts';
import AuditHelpProvider from './AuditHelpProvider.ts';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.ts';
import EvolutionHelpProvider from './EvolutionHelpProvider.ts';
import { runMigrations } from './MigrationRunner.ts';
import AccountModel from './models/AccountModel.ts';
import { AccountModelType } from './models/AccountModel.ts';
import ApplicationModel from './models/ApplicationModel.ts';
import { ApplicationModelType } from './models/ApplicationModel.ts';
import AuditHelpModel from './models/AuditHelpModel.ts';
import AuditModel from './models/AuditModel.ts';
import DependencyModel from './models/DependencyModel.ts';
import DependencyStatusHelpModel from './models/DependencyStatusHelpModel.ts';
import DeprecatedDependencyModel from './models/DeprecatedDependencyModel.ts';
import EvolutionHelpModelModel from './models/EvolutionHelpModel.ts';
import EvolutionModel from './models/EvolutionModel.ts';
import FaqModel from './models/FaqModel.ts';
import KeywordModel from './models/KeywordModel.ts';
import NotificationModel from './models/NotificationModel.ts';

let postgresDataBase: Sequelize | null = null;

interface DbOptions {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort: string;
}

/**
 * Establishes a connection to the PostgresSQL database
 * @param dbOptions
 */
const postgresDataBaseConnector = (dbOptions: DbOptions) => {
    return new Sequelize(dbOptions?.dbName, dbOptions?.dbUser, dbOptions?.dbPassword, {
        host: dbOptions?.dbHost,
        port: parseInt(dbOptions?.dbPort),
        operatorsAliases: false as unknown as OperatorsAliases,
        dialect: 'postgres',
        dialectOptions: {
            // Your pg options here
        },
        define: {
            underscored: true,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
};

/**
 * Gets the current PostgresSQL database instance
 *
 * @returns {Sequelize|null} The PostgresSQL database instance or null if not connected
 */
const getDataBaseInstance = () => postgresDataBase;

/**
 * Initializes default data
 *
 * This function calls the `initDefaultData` methods of different Providers
 * to ensure that the necessary default data is present in the database.
 */
const initDefaultData = async () => {
    await EvolutionHelpProvider.initDefaultData();
    await AuditHelpProvider.initDefaultData();
    await DependencyStatusHelpProvider.initDefaultData();

    if (process.env.NODE_ENV === 'development') {
        const devEmail = 'superadmin@example.com';
        const existing = await AccountModelType.findOne({ where: { email: devEmail } });
        if (!existing) {
            await AccountModelType.create({
                username: 'superadmin',
                email: devEmail,
                password: await hashPassword('superadmin'),
                role: 'SUPERADMIN',
                applications: [],
            });
            AppLogger.info(`[DataBaseManager - initDefaultData] Dev superadmin account created`);
        }

        const devAppName = 'v6y-dev-app';
        const existingApp = await ApplicationModelType.findOne({ where: { name: devAppName } });
        if (!existingApp) {
            await ApplicationModelType.create({
                name: devAppName,
                acronym: 'VDA',
                contactMail: 'dev@example.com',
                description: 'Default development application for local testing',
                repo: {
                    webUrl: 'https://github.com/example/v6y-dev-app',
                    gitUrl: 'git@github.com:example/v6y-dev-app.git',
                    organization: 'example',
                },
                links: [
                    {
                        label: 'Production',
                        value: 'https://example.com',
                        description: 'Production URL',
                    },
                ],
                configuration: {},
            });
            AppLogger.info(`[DataBaseManager - initDefaultData] Dev application created`);
        }
    }
};

/**
 * Registers Sequelize models with the database.
 */
const registerModels = async () => {
    if (!postgresDataBase) {
        return;
    }
    AccountModel(postgresDataBase);
    ApplicationModel(postgresDataBase);
    AuditModel(postgresDataBase);
    DependencyModel(postgresDataBase);
    DeprecatedDependencyModel(postgresDataBase);
    EvolutionModel(postgresDataBase);
    FaqModel(postgresDataBase);
    KeywordModel(postgresDataBase);
    NotificationModel(postgresDataBase);
    AuditHelpModel(postgresDataBase);
    EvolutionHelpModelModel(postgresDataBase);
    DependencyStatusHelpModel(postgresDataBase);
};

/**
 * Establishes a connection to the PostgresSQL database, registers models, and synchronizes them
 * @returns {Promise<void>}
 */
const connect = async () => {
    try {
        postgresDataBase = postgresDataBaseConnector({
            dbHost: process.env.PSQL_DB_HOST || 'localhost',
            dbName: process.env.PSQL_DB_NAME || 'v6y',
            dbUser: process.env.PSQL_DB_USER || 'v6y',
            dbPassword: process.env.PSQL_DB_PASSWORD || 'v6y',
            dbPort: process.env.PSQL_DB_PORT || '5432',
        });
        await postgresDataBase.authenticate();

        AppLogger.info(
            `[DataBaseManager - connect] PSQL connection has been established successfully`,
        );

        // Run Prisma migrations to ensure audit schema is up to date
        await runMigrations();
        AppLogger.info(`[DataBaseManager - connect] PSQL migrations completed successfully`);

        await registerModels();
        AppLogger.info(`[DataBaseManager - connect] PSQL registering models made successfully`);

        await postgresDataBase.sync({ alter: true });
        AppLogger.info(`[DataBaseManager - connect] PSQL synchronizing models made successfully`);

        await initDefaultData();
        AppLogger.info(`[DataBaseManager - connect] PSQL init default data made successfully`);
    } catch (error) {
        AppLogger.error(
            `[DataBaseManager - connect] PSQL connection an error was occurred: `,
            error,
        );
    }
};

/**
 * Disconnects from the PostgresSQL database. (Currently not implemented)
 */
const disconnect = async () => {};

/**
 * An object that manages the connection to and interaction with the PostgresSQL database
 */
const DataBaseManager = {
    connect,
    disconnect,
    getDataBaseInstance,
};

export default DataBaseManager;

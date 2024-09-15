import { Sequelize } from 'sequelize';

import AppLogger from '../core/AppLogger.js';
import AuditHelpProvider from './AuditHelpProvider.js';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.js';
import EvolutionHelpProvider from './EvolutionHelpProvider.js';
import ApplicationModel from './models/ApplicationModel.js';
import AuditHelpModel from './models/AuditHelpModel.js';
import AuditModel from './models/AuditModel.js';
import DependencyModel from './models/DependencyModel.js';
import DependencyStatusHelpModel from './models/DependencyStatusHelpModel.js';
import DeprecatedDependencyModel from './models/DeprecatedDependencyModel.js';
import EvolutionHelpModelModel from './models/EvolutionHelpModel.js';
import FaqModel from './models/FaqModel.js';
import NotificationModel from './models/NotificationModel.js';

let postgresDataBase = null;
let postgresDataBaseSchema = {};

/**
 * Creates a Sequelize instance to connect to a PostgreSQL database.
 *
 * @param {Object} dbOptions - An object containing database connection options:
 *   - dbName (string): The name of the database.
 *   - dbUser (string): The database user.
 *   - dbPassword (string): The database password.
 *   - dbHost (string): The database host.
 *   - dbPort (number): The database port.
 * @returns {Sequelize} A Sequelize instance configured with the provided options.
 */
const postgresDataBaseConnector = (dbOptions) => {
    return new Sequelize(dbOptions?.dbName, dbOptions?.dbUser, dbOptions?.dbPassword, {
        host: dbOptions?.dbHost,
        port: dbOptions?.dbPort,
        operatorsAliases: false,
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
 * Gets the current PostgreSQL database instance
 *
 * @returns {Sequelize|null} The PostgreSQL database instance or null if not connected
 */
const getDataBaseInstance = () => postgresDataBase;

/**
 * Gets a specific schema from the PostgreSQL database
 *
 * @param {string} schemaName - The name of the schema to retrieve
 * @returns {Object|undefined} The schema object or undefined if not found
 */
const getDataBaseSchema = (schemaName) => postgresDataBaseSchema?.[schemaName];

/**
 * Initializes default data
 *
 * This function calls the `initDefaultData` methods of different Providers
 * to ensure that the necessary default data is present in the database.
 */
const initDefaultData = async () => {
    try {
        await EvolutionHelpProvider.initDefaultData();
    } catch {}

    try {
        await AuditHelpProvider.initDefaultData();
    } catch {}

    try {
        await DependencyStatusHelpProvider.initDefaultData();
    } catch {}
};

/**
 * Registers Sequelize models with the database.
 */
const registerModels = async () => {
    postgresDataBaseSchema[ApplicationModel.name] = postgresDataBase?.define(
        ApplicationModel.name,
        ApplicationModel.schema,
        ApplicationModel.options,
    );
    postgresDataBaseSchema[AuditModel.name] = postgresDataBase?.define(
        AuditModel.name,
        AuditModel.schema,
        AuditModel.options,
    );
    postgresDataBaseSchema[AuditHelpModel.name] = postgresDataBase?.define(
        AuditHelpModel.name,
        AuditHelpModel.schema,
        AuditHelpModel.options,
    );
    postgresDataBaseSchema[DependencyModel.name] = postgresDataBase?.define(
        DependencyModel.name,
        DependencyModel.schema,
        DependencyModel.options,
    );
    postgresDataBaseSchema[DependencyStatusHelpModel.name] = postgresDataBase?.define(
        DependencyStatusHelpModel.name,
        DependencyStatusHelpModel.schema,
        DependencyStatusHelpModel.options,
    );
    postgresDataBaseSchema[DeprecatedDependencyModel.name] = postgresDataBase?.define(
        DeprecatedDependencyModel.name,
        DeprecatedDependencyModel.schema,
        DeprecatedDependencyModel.options,
    );
    postgresDataBaseSchema[EvolutionHelpModelModel.name] = postgresDataBase?.define(
        EvolutionHelpModelModel.name,
        EvolutionHelpModelModel.schema,
        EvolutionHelpModelModel.options,
    );
    postgresDataBaseSchema[FaqModel.name] = postgresDataBase?.define(
        FaqModel.name,
        FaqModel.schema,
        FaqModel.options,
    );
    postgresDataBaseSchema[NotificationModel.name] = postgresDataBase?.define(
        NotificationModel.name,
        NotificationModel.schema,
        NotificationModel.options,
    );
};

/**
 * Establishes a connection to the PostgreSQL database, registers models, and synchronizes them
 * @returns {Promise<void>}
 */
const connect = async () => {
    try {
        postgresDataBase = postgresDataBaseConnector({
            dbHost: process.env.PSQL_DB_HOST,
            dbName: process.env.PSQL_DB_NAME,
            dbUser: process.env.PSQL_DB_USER,
            dbPassword: process.env.PSQL_DB_PASSWORD,
            dbPort: process.env.PSQL_DB_PORT,
        });
        await postgresDataBase.authenticate();

        AppLogger.info(
            `[DataBaseManager - connect] PSQL connection has been established successfully`,
        );

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
 * Disconnects from the PostgreSQL database. (Currently not implemented)
 */
const disconnect = async () => {};

/**
 * An object that manages the connection to and interaction with the PostgreSQL database
 */
const DataBaseManager = {
    connect,
    disconnect,
    getDataBaseInstance,
    getDataBaseSchema,
};

export default DataBaseManager;

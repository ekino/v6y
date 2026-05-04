import { OperatorsAliases, Sequelize } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import AuditHelpProvider from './AuditHelpProvider.ts';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.ts';
import EvolutionHelpProvider from './EvolutionHelpProvider.ts';
import AccountApplicationModel, {
    AccountApplicationModelType,
} from './models/AccountApplicationModel.ts';
import AccountModel, { AccountModelType } from './models/AccountModel.ts';
import ApplicationModel, { ApplicationModelType } from './models/ApplicationModel.ts';
import AuditHelpModel, { AuditHelpModelType } from './models/AuditHelpModel.ts';
import AuditModel, { AuditModelType } from './models/AuditModel.ts';
import AuditRunModel, { AuditRunModelType } from './models/AuditRunModel.ts';
import DependencyModel, { DependencyModelType } from './models/DependencyModel.ts';
import DependencyStatusHelpModel, {
    DependencyStatusHelpModelType,
} from './models/DependencyStatusHelpModel.ts';
import DeprecatedDependencyModel from './models/DeprecatedDependencyModel.ts';
import EvolutionHelpModelModel, { EvolutionHelpModelType } from './models/EvolutionHelpModel.ts';
import EvolutionModel, { EvolutionModelType } from './models/EvolutionModel.ts';
import FaqModel from './models/FaqModel.ts';
import KeywordModel, { KeywordModelType } from './models/KeywordModel.ts';
import ModuleModel, { ModuleModelType } from './models/ModuleModel.ts';
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
        dialectOptions: {},
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
};

/**
 * Registers Sequelize models with the database.
 */
const registerModels = () => {
    if (!postgresDataBase) {
        return;
    }
    AccountModel(postgresDataBase);
    AccountApplicationModel(postgresDataBase);
    ApplicationModel(postgresDataBase);
    ModuleModel(postgresDataBase);
    AuditRunModel(postgresDataBase);
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
 * Defines all Sequelize associations (relationships between models).
 * Must be called after all models are initialised.
 */
const registerAssociations = () => {
    // Application → children (CASCADE delete)
    ApplicationModelType.hasMany(AuditRunModelType, { foreignKey: 'appId', onDelete: 'CASCADE' });
    ApplicationModelType.hasMany(AuditModelType, { foreignKey: 'appId', onDelete: 'CASCADE' });
    ApplicationModelType.hasMany(DependencyModelType, {
        foreignKey: 'appId',
        onDelete: 'CASCADE',
    });
    ApplicationModelType.hasMany(EvolutionModelType, { foreignKey: 'appId', onDelete: 'CASCADE' });
    ApplicationModelType.hasMany(KeywordModelType, { foreignKey: 'appId', onDelete: 'CASCADE' });
    ApplicationModelType.hasMany(ModuleModelType, { foreignKey: 'appId', onDelete: 'CASCADE' });
    ApplicationModelType.hasMany(AccountApplicationModelType, {
        foreignKey: 'appId',
        onDelete: 'CASCADE',
    });

    // AuditRun → AuditReport
    AuditRunModelType.hasMany(AuditModelType, {
        as: 'auditReports',
        foreignKey: 'auditRunId',
        onDelete: 'CASCADE',
    });
    AuditModelType.belongsTo(AuditRunModelType, { as: 'auditRun', foreignKey: 'auditRunId' });

    // Module associations (shared across audit, dependency, evolution, keyword)
    AuditModelType.belongsTo(ModuleModelType, { as: 'module', foreignKey: 'moduleId' });
    DependencyModelType.belongsTo(ModuleModelType, { as: 'module', foreignKey: 'moduleId' });
    EvolutionModelType.belongsTo(ModuleModelType, { as: 'module', foreignKey: 'moduleId' });
    KeywordModelType.belongsTo(ModuleModelType, { as: 'module', foreignKey: 'moduleId' });

    // Help FK associations
    AuditModelType.belongsTo(AuditHelpModelType, { as: 'auditHelp', foreignKey: 'auditHelpId' });
    DependencyModelType.belongsTo(DependencyStatusHelpModelType, {
        as: 'statusHelp',
        foreignKey: 'statusHelpId',
    });
    EvolutionModelType.belongsTo(EvolutionHelpModelType, {
        as: 'evolutionHelp',
        foreignKey: 'evolutionHelpId',
    });

    // Account → AccountApplication join table
    AccountModelType.hasMany(AccountApplicationModelType, {
        as: 'accountApplications',
        foreignKey: 'accountId',
        onDelete: 'CASCADE',
    });
};

/**
 * Establishes a connection to the PostgresSQL database, registers models and associations.
 * Schema changes are handled exclusively via sequelize-cli migrations
 * (`pnpm run migrate-db` in v6y-libs/core-logic).
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

        registerModels();
        AppLogger.info(`[DataBaseManager - connect] PSQL registering models made successfully`);

        registerAssociations();
        AppLogger.info(
            `[DataBaseManager - connect] PSQL registering associations made successfully`,
        );

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

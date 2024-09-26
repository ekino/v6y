"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const AuditHelpProvider_1 = __importDefault(require("./AuditHelpProvider"));
const DependencyStatusHelpProvider_1 = __importDefault(require("./DependencyStatusHelpProvider"));
const EvolutionHelpProvider_1 = __importDefault(require("./EvolutionHelpProvider"));
const ApplicationModel_1 = __importDefault(require("./models/ApplicationModel"));
const AuditHelpModel_1 = __importDefault(require("./models/AuditHelpModel"));
const AuditModel_1 = __importDefault(require("./models/AuditModel"));
const DependencyModel_1 = __importDefault(require("./models/DependencyModel"));
const DependencyStatusHelpModel_1 = __importDefault(require("./models/DependencyStatusHelpModel"));
const DeprecatedDependencyModel_1 = __importDefault(require("./models/DeprecatedDependencyModel"));
const EvolutionHelpModel_1 = __importDefault(require("./models/EvolutionHelpModel"));
const EvolutionModel_1 = __importDefault(require("./models/EvolutionModel"));
const FaqModel_1 = __importDefault(require("./models/FaqModel"));
const KeywordModel_1 = __importDefault(require("./models/KeywordModel"));
const NotificationModel_1 = __importDefault(require("./models/NotificationModel"));
let postgresDataBase = null;
/**
 * Establishes a connection to the PostgresSQL database
 * @param dbOptions
 */
const postgresDataBaseConnector = (dbOptions) => {
    return new sequelize_1.Sequelize(dbOptions?.dbName, dbOptions?.dbUser, dbOptions?.dbPassword, {
        host: dbOptions?.dbHost,
        port: parseInt(dbOptions?.dbPort),
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
    await EvolutionHelpProvider_1.default.initDefaultData();
    await AuditHelpProvider_1.default.initDefaultData();
    await DependencyStatusHelpProvider_1.default.initDefaultData();
};
/**
 * Registers Sequelize models with the database.
 */
const registerModels = async () => {
    if (!postgresDataBase) {
        return;
    }
    (0, ApplicationModel_1.default)(postgresDataBase);
    (0, AuditModel_1.default)(postgresDataBase);
    (0, DependencyModel_1.default)(postgresDataBase);
    (0, DeprecatedDependencyModel_1.default)(postgresDataBase);
    (0, EvolutionModel_1.default)(postgresDataBase);
    (0, FaqModel_1.default)(postgresDataBase);
    (0, KeywordModel_1.default)(postgresDataBase);
    (0, NotificationModel_1.default)(postgresDataBase);
    (0, AuditHelpModel_1.default)(postgresDataBase);
    (0, EvolutionHelpModel_1.default)(postgresDataBase);
    (0, DependencyStatusHelpModel_1.default)(postgresDataBase);
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
        AppLogger_1.default.info(`[DataBaseManager - connect] PSQL connection has been established successfully`);
        await registerModels();
        AppLogger_1.default.info(`[DataBaseManager - connect] PSQL registering models made successfully`);
        await postgresDataBase.sync({ alter: true });
        AppLogger_1.default.info(`[DataBaseManager - connect] PSQL synchronizing models made successfully`);
        await initDefaultData();
        AppLogger_1.default.info(`[DataBaseManager - connect] PSQL init default data made successfully`);
    }
    catch (error) {
        AppLogger_1.default.error(`[DataBaseManager - connect] PSQL connection an error was occurred: `, error);
    }
};
/**
 * Disconnects from the PostgresSQL database. (Currently not implemented)
 */
const disconnect = async () => { };
/**
 * An object that manages the connection to and interaction with the PostgresSQL database
 */
const DataBaseManager = {
    connect,
    disconnect,
    getDataBaseInstance,
};
exports.default = DataBaseManager;

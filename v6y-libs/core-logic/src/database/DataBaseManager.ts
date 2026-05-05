import AppLogger from '../core/AppLogger.ts';
import AuditHelpProvider from './AuditHelpProvider.ts';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.ts';
import EvolutionHelpProvider from './EvolutionHelpProvider.ts';
import { disconnectPrismaClient, getPrismaClient } from './PrismaClient.ts';

/**
 * Gets the current Prisma client instance
 */
const getDataBaseInstance = () => getPrismaClient();

/**
 * Initializes default reference data (audit help, evolution help, dependency status help).
 * Runs only if the tables are empty — safe to call on every startup.
 */
const initDefaultData = async () => {
    await EvolutionHelpProvider.initDefaultData();
    await AuditHelpProvider.initDefaultData();
    await DependencyStatusHelpProvider.initDefaultData();
};

/**
 * Establishes a connection to the PostgreSQL database via Prisma and seeds reference data.
 */
const connect = async () => {
    try {
        const prisma = getPrismaClient();
        await prisma.$connect();

        AppLogger.info(
            `[DataBaseManager - connect] Prisma connection has been established successfully`,
        );

        await initDefaultData();
        AppLogger.info(`[DataBaseManager - connect] Default data initialized successfully`);
    } catch (error) {
        AppLogger.error(`[DataBaseManager - connect] An error occurred during connection: `, error);
    }
};

/**
 * Gracefully disconnects from the PostgreSQL database.
 */
const disconnect = async () => {
    await disconnectPrismaClient();
};

/**
 * An object that manages the connection to and interaction with the PostgreSQL database
 */
const DataBaseManager = {
    connect,
    disconnect,
    getDataBaseInstance,
};

export default DataBaseManager;

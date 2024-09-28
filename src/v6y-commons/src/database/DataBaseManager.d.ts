import { Sequelize } from 'sequelize';
/**
 * An object that manages the connection to and interaction with the PostgresSQL database
 */
declare const DataBaseManager: {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getDataBaseInstance: () => Sequelize | null;
};
export default DataBaseManager;

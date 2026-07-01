import { ServerEnvConfigType, getServerConfig, normalizeBasePath } from '@v6y/core-logic';

const V6Y_API_BASE_PATH = normalizeBasePath(process.env.V6Y_BFF_API_PATH);
const V6Y_MONITORING_PATH = `${V6Y_API_BASE_PATH}monitoring`;

const V6Y_MAIN_API_PATH = normalizeBasePath(process.env.V6Y_MAIN_API_PATH);
const MAIN_ANALYZER_API_PATH = `${V6Y_MAIN_API_PATH}trigger-audit`;

const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_BFF_API_PORT || '4001', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_BFF_API_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        mainAnalyzerApiPath: MAIN_ANALYZER_API_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_BFF_API_PORT || '4001', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_BFF_API_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        mainAnalyzerApiPath: MAIN_ANALYZER_API_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
    },
} as ServerEnvConfigType;

/**
 * Get the current context and configuration of the server.
 */
const ServerConfig = {
    currentConfig: getServerConfig(SERVER_ENV_CONFIGURATION),
};

export default ServerConfig;

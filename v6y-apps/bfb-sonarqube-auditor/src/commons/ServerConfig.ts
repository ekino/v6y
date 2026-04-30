import { ServerEnvConfigType, getServerConfig, normalizeBasePath } from '@v6y/core-logic';

const V6Y_API_BASE_PATH = normalizeBasePath(process.env.V6Y_SONARQUBE_API_PATH);
const V6Y_HEALTH_CHECK_PATH = `${V6Y_API_BASE_PATH}health-checks`;
const V6Y_MONITORING_PATH = `${V6Y_API_BASE_PATH}monitoring`;
const SONARQUBE_AUDITOR_API_PATH = `${V6Y_API_BASE_PATH}auditor`;

/**
 * Server configuration for different environments.
 */
const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_SONARQUBE_API_PORT || '4007', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_SONARQUBE_API_PATH,
        sonarqubeAuditorApiPath: SONARQUBE_AUDITOR_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 30000, // milliseconds
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_SONARQUBE_API_PORT || '4007', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_SONARQUBE_API_PATH,
        sonarqubeAuditorApiPath: SONARQUBE_AUDITOR_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 30000, // milliseconds
    },
} as ServerEnvConfigType;

/**
 * Get the current context and configuration of the server.
 */
const ServerConfig = {
    currentConfig: getServerConfig(SERVER_ENV_CONFIGURATION),
};

export default ServerConfig;

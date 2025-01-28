import { ServerEnvConfigType, getEnvironmentContext, getServerConfig } from '@v6y/core-logic';

const V6Y_DYNAMIC_HEALTH_CHECK_PATH = `${process.env.V6Y_DYNAMIC_ANALYZER_API_PATH}/health-checks`;
const V6Y_DYNAMIC_MONITORING_PATH = `${process.env.V6Y_DYNAMIC_ANALYZER_API_PATH}/monitoring`;
const V6Y_DYNAMIC_AUDITOR_API_PATH = `${process.env.V6Y_DYNAMIC_ANALYZER_API_PATH}/auditor`;

/**
 * Server configuration for different environments.
 */
const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_DYNAMIC_ANALYZER_API_PORT || '4004', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
        dynamicAuditorApiPath: V6Y_DYNAMIC_AUDITOR_API_PATH,
        healthCheckPath: V6Y_DYNAMIC_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_DYNAMIC_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/applis/appf/chrome-linux/chrome',
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_DYNAMIC_ANALYZER_API_PORT || '4004', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
        dynamicAuditorApiPath: V6Y_DYNAMIC_AUDITOR_API_PATH,
        healthCheckPath: V6Y_DYNAMIC_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_DYNAMIC_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
} as ServerEnvConfigType;

/**
 * Get the current context of the server.
 */
const currentContext = getEnvironmentContext();

/**
 * Get the current configuration of the server.
 */

const currentConfig = getServerConfig(SERVER_ENV_CONFIGURATION);

const ServerConfig = {
    currentConfig,
    currentContext,
};

export default ServerConfig;

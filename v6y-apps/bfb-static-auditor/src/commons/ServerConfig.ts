import { ServerEnvConfigType, getServerConfig } from '@v6y/core-logic';

const V6Y_HEALTH_CHECK_PATH = `${process.env.V6Y_STATIC_ANALYZER_API_PATH}health-checks`;
const V6Y_MONITORING_PATH = `${process.env.V6Y_STATIC_ANALYZER_API_PATH}monitoring`;
const STATIC_CODE_AUDITOR_API_PATH = `${process.env.V6Y_STATIC_ANALYZER_API_PATH}auditor`;

/**
 * Server configuration for different environments.
 */
const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_STATIC_ANALYZER_API_PORT || '4003', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        staticAuditorApiPath: STATIC_CODE_AUDITOR_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/applis/appf/chrome-linux/chrome',
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_STATIC_ANALYZER_API_PORT || '4003', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        staticAuditorApiPath: STATIC_CODE_AUDITOR_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
} as ServerEnvConfigType;

/**
 * Get the current context and configuration of the server.
 */
const ServerConfig = {
    currentConfig: getServerConfig(SERVER_ENV_CONFIGURATION),
};

export default ServerConfig;

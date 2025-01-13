import { AppLogger, ServerEnvConfigType } from '@v6y/core-logic';

const V6Y_HEALTH_CHECK_PATH = `${process.env.V6Y_STATIC_ANALYZER_API_PATH}health-checks`;
const V6Y_MONITORING_PATH = `${process.env.V6Y_STATIC_ANALYZER_API_PATH}monitoring`;
const STATIC_CODE_AUDITOR_API_PATH = `${process.env.V6Y_STATIC_ANALYZER_API_PATH}auditor`;

const execEnv = process?.argv;

/**
 * Server configuration for different environments.
 */
const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_STATIC_ANALYZER_API_PORT || '4003', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        staticCodeAuditorApiPath: STATIC_CODE_AUDITOR_API_PATH,
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
        staticCodeAuditorApiPath: STATIC_CODE_AUDITOR_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
} as ServerEnvConfigType;

/**
 * Get the current context of the server.
 */
const getCurrentContext = () => (execEnv?.includes('--dev') ? 'development' : 'production');

/**
 * Get the current configuration of the server.
 */
const getCurrentConfig = () => {
    const currentContext = getCurrentContext();
    AppLogger.info(`[getCurrentConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${
            currentConfig.hostname
        }:${currentConfig.port}${currentConfig.apiPath}`,
    };
};

const ServerConfig = {
    getCurrentConfig,
    getCurrentContext,
};

export default ServerConfig;

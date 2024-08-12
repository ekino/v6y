import { AppLogger } from '@v6y/commons';

const V6Y_API_PATH = '/v6y/graphql';
const V6Y_HEALTH_CHECK_PATH = `${V6Y_API_PATH}/health-checks`;
const V6Y_MONITORING_PATH = `${V6Y_API_PATH}/monitoring`;

const execEnv = process?.argv;

/**
 * Server configuration for different environments.
 * @type {Object}
 */
const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: 4001,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: 4001,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        // databaseUri: '',
        serverTimeout: 900000, // milliseconds
    },
};

const getCurrentContext = () => (execEnv?.includes('--dev') ? 'development' : 'production');

const getCurrentConfig = () => {
    const currentContext = getCurrentContext();
    AppLogger.info(`[getCurrentConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${currentConfig.hostname}:${currentConfig.port}${currentConfig.apiPath}`,
    };
};

/**
 * Server configuration module.
 * @type {Object}
 */
const ServerConfig = {
    getCurrentConfig,
    getCurrentContext,
};

export default ServerConfig;

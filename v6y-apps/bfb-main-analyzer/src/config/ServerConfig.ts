import { AppLogger, ServerEnvConfigType } from '@v6y/core-logic';

const V6Y_HEALTH_CHECK_PATH = `${process.env.V6Y_MAIN_API_PATH}health-checks`;
const V6Y_MONITORING_PATH = `${process.env.V6Y_MAIN_API_PATH}monitoring`;

const execEnv = process?.argv;

const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_DEVOPS_API_PORT || '4002', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_MAIN_API_PATH,
        frontendStaticCodeAuditorApi: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        frontendUrlDynamicAuditorApi: process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_DEVOPS_API_PORT || '4002', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_MAIN_API_PATH,
        frontendStaticCodeAuditorApi: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        frontendUrlDynamicAuditorApi: process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
} as ServerEnvConfigType;

/**
 * Get the current context of the server
 */
const getCurrentContext = (): 'development' | 'production' =>
    execEnv?.includes('--dev') ? 'development' : 'production';

/**
 * Get the current configuration of the server
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

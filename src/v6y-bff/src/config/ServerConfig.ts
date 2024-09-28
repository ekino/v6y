import { AppLogger } from '@v6y/commons';

const V6Y_API_PATH = '/v6y/graphql';
const V6Y_HEALTH_CHECK_PATH = `${V6Y_API_PATH}/health-checks`;
const V6Y_MONITORING_PATH = `${V6Y_API_PATH}/monitoring`;

const execEnv = process?.argv;

type ServerConfig = {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
};

const SERVER_ENV_CONFIGURATION: Record<string, ServerConfig> = {
    production: {
        ssl: false,
        port: 4001,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: 4001,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
};

const getCurrentContext = (): string => (execEnv?.includes('--dev') ? 'development' : 'production');

const getCurrentConfig = (): Record<string, unknown> => {
    const currentContext = getCurrentContext();
    AppLogger.info(`[getCurrentConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${currentConfig.hostname}:${currentConfig.port}${currentConfig.apiPath}`,
    };
};

const ServerConfig = {
    getCurrentConfig,
    getCurrentContext,
};

export default ServerConfig;

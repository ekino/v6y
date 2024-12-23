import { AppLogger } from '@v6y/commons';

const V6Y_API_PATH = process.env.NEXT_PUBLIC_V6Y_GQL_API_PATH;
const V6Y_HEALTH_CHECK_PATH = process.env.NEXT_PUBLIC_V6Y_GQL_HEALTH_CHECK_PATH;
const V6Y_MONITORING_PATH = process.env.NEXT_PUBLIC_V6Y_GQL_MONITORING_PATH;

if (!V6Y_API_PATH || !V6Y_HEALTH_CHECK_PATH || !V6Y_MONITORING_PATH) {
    throw new Error('Missing environment variables');
}

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

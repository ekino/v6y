import { AppLogger } from '@v6y/commons';

const V6Y_API_PATH = '/v6y/bfb-main';
const V6Y_HEALTH_CHECK_PATH = `${V6Y_API_PATH}/health-checks`;
const V6Y_MONITORING_PATH = `${V6Y_API_PATH}/monitoring`;

const execEnv = process?.argv;

interface ServerEnvConfig {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath: string;
    frontendStaticAuditorApi: string;
    frontendDynamicAuditorApi: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
}

const SERVER_ENV_CONFIGURATION: { [key: string]: ServerEnvConfig } = {
    production: {
        ssl: false,
        port: 4003,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        frontendStaticAuditorApi:
            'http://localhost:4002/v6y/bfb-frontend-auditor/auditor/start-frontend-static-auditor.json',
        frontendDynamicAuditorApi:
            'http://localhost:4002/v6y/bfb-frontend-auditor/auditor/start-frontend-dynamic-auditor.json',
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: 4003,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        frontendStaticAuditorApi:
            'http://localhost:4002/v6y/bfb-frontend-auditor/auditor/start-frontend-static-auditor.json',
        frontendDynamicAuditorApi:
            'http://localhost:4002/v6y/bfb-frontend-auditor/auditor/start-frontend-dynamic-auditor.json',
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
};

const getCurrentContext = (): 'development' | 'production' =>
    execEnv?.includes('--dev') ? 'development' : 'production';

const getCurrentConfig = (): ServerEnvConfig & { serverUrl: string } => {
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

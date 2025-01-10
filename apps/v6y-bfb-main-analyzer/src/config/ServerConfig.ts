import { AppLogger } from '@v6y/core-logic';

const V6Y_API_PATH = '/v6y/bfb-main';
const V6Y_HEALTH_CHECK_PATH = `${V6Y_API_PATH}/health-checks`;
const V6Y_MONITORING_PATH = `${V6Y_API_PATH}/monitoring`;

const execEnv = process?.argv;

interface ServerEnvConfig {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath: string;
    frontendStaticCodeAuditorApi: string;
    frontendUrlDynamicAuditorApi: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
}

const SERVER_ENV_CONFIGURATION: { [key: string]: ServerEnvConfig } = {
    production: {
        ssl: false,
        port: 4002,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        frontendStaticCodeAuditorApi:
            'http://localhost:4003/v6y/bfb-static-code-auditor/auditor/start-static-code-auditor.json',
        frontendUrlDynamicAuditorApi:
            'http://localhost:4004/v6y/bfb-url-dynamic-auditor/auditor/start-frontend-dynamic-auditor.json',
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: 4002,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        frontendStaticCodeAuditorApi:
            'http://localhost:4003/v6y/bfb-static-code-auditor/auditor/start-static-code-auditor.json',
        frontendUrlDynamicAuditorApi:
            'http://localhost:4004/v6y/bfb-url-dynamic-auditor/auditor/start-frontend-dynamic-auditor.json',
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

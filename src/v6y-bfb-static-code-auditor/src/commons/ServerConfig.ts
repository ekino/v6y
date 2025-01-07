import { AppLogger } from '@v6y/commons';

const V6Y_API_PATH = process.env.NEXT_PUBLIC_V6Y_BFB_STATIC_CODE_AUDITOR_API_PATH;
const V6Y_HEALTH_CHECK_PATH = process.env.NEXT_PUBLIC_V6Y_BFB_STATIC_CODE_AUDITOR_HEALTH_CHECK_PATH;
const V6Y_MONITORING_PATH = process.env.NEXT_PUBLIC_V6Y_BFB_STATIC_CODE_AUDITOR_MONITORING_PATH;
const FRONTEND_AUDITOR_API_PATH = process.env.NEXT_PUBLIC_V6Y_BFB_STATIC_CODE_AUDITOR_PATH;

const execEnv = process?.argv;

if (!V6Y_API_PATH || !V6Y_HEALTH_CHECK_PATH || !V6Y_MONITORING_PATH || !FRONTEND_AUDITOR_API_PATH) {
    throw new Error('Missing environment variables');
}

interface ServerEnvConfig {
    ssl: boolean;
    port: number;
    hostname: string;
    apiPath: string;
    healthCheckPath: string;
    monitoringPath: string;
    serverTimeout: number;
    staticCodeAuditorApiPath: string;
    databaseUri: string;
    chromeExecutablePath: string;
}

/**
 * Server configuration for different environments.
 * @type {Object}
 */
const SERVER_ENV_CONFIGURATION: { [key: string]: ServerEnvConfig } = {
    production: {
        ssl: false,
        port: 4003,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        staticCodeAuditorApiPath: V6Y_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/applis/appf/chrome-linux/chrome',
    },
    development: {
        ssl: false,
        port: 4003,
        hostname: 'localhost',
        apiPath: V6Y_API_PATH,
        staticCodeAuditorApiPath: V6Y_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
        chromeExecutablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    },
};

const getCurrentContext = () => (execEnv?.includes('--dev') ? 'development' : 'production');

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

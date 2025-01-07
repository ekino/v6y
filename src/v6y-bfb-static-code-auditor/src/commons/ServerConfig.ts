import { AppLogger } from '@v6y/commons';

const V6Y_API_PATH = '/v6y/bfb-static-code-auditor/';
const V6Y_HEALTH_CHECK_PATH = `${V6Y_API_PATH}health-checks`;
const V6Y_MONITORING_PATH = `${V6Y_API_PATH}monitoring`;
const STATIC_CODE_AUDITOR_API_PATH = `${V6Y_API_PATH}auditor`;

const execEnv = process?.argv;

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
        staticCodeAuditorApiPath: STATIC_CODE_AUDITOR_API_PATH,
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
        staticCodeAuditorApiPath: STATIC_CODE_AUDITOR_API_PATH,
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

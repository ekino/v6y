import { ServerEnvConfigType, getServerConfig } from '@v6y/core-logic';

const V6Y_HEALTH_CHECK_PATH = `${process.env.V6Y_MAIN_API_PATH}health-checks`;
const V6Y_MONITORING_PATH = `${process.env.V6Y_MAIN_API_PATH}monitoring`;

const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_MAIN_API_PORT || '4002', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_MAIN_API_PATH,
        staticAuditorApiPath: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        dynamicAuditorApiPath: process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
        devopsAuditorApiPath: process.env.V6Y_DEVOPS_ANALYSER_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_MAIN_API_PORT || '4002', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_MAIN_API_PATH,
        staticAuditorApiPath: process.env.V6Y_STATIC_ANALYZER_API_PATH,
        dynamicAuditorApiPath: process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
        devopsAuditorApiPath: process.env.V6Y_DEVOPS_ANALYSER_API_PATH,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        serverTimeout: 900000, // milliseconds
    },
} as ServerEnvConfigType;

/**
 * Get the current context and configuration of the server.
 */
const ServerConfig = {
    currentConfig: getServerConfig(SERVER_ENV_CONFIGURATION),
};

export default ServerConfig;

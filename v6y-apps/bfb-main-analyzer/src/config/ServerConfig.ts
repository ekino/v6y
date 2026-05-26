import {
    AppLogger,
    ServerEnvConfigType,
    getServerConfig,
    normalizeBasePath,
} from '@v6y/core-logic';

const V6Y_API_BASE_PATH = normalizeBasePath(process.env.V6Y_MAIN_API_PATH);
const V6Y_MONITORING_PATH = `${V6Y_API_BASE_PATH}monitoring`;
const V6Y_HEALTH_CHECK_PATH = '/health';

// Construct full URLs for auditor services
const buildAuditorUrl = (
    apiPath: string | undefined,
    port: string | undefined,
    endpoint: string,
): string => {
    if (!apiPath) {
        AppLogger.warn('[buildAuditorUrl] Missing apiPath');
        return '';
    }

    // Backward compatibility: some environments still provide a full URL.
    if (apiPath.startsWith('http://') || apiPath.startsWith('https://')) {
        AppLogger.debug(`[buildAuditorUrl] Full URL provided via apiPath: ${apiPath}`);
        return apiPath;
    }

    if (!port) {
        AppLogger.warn(`[buildAuditorUrl] Missing port for apiPath: ${apiPath}`);
        return '';
    }
    const normalizedPath = normalizeBasePath(apiPath);
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `http://localhost:${port}${normalizedPath}${normalizedEndpoint}`;
    AppLogger.debug(`[buildAuditorUrl] apiPath: ${apiPath}, port: ${port}, endpoint: ${endpoint}`);
    AppLogger.debug(
        `[buildAuditorUrl] normalizedPath: ${normalizedPath}, normalizedEndpoint: ${normalizedEndpoint}`,
    );
    AppLogger.debug(`[buildAuditorUrl] Result: ${fullUrl}`);
    return fullUrl;
};

const STATIC_AUDITOR_ENDPOINT = buildAuditorUrl(
    process.env.V6Y_STATIC_ANALYZER_API_PATH,
    process.env.V6Y_STATIC_ANALYZER_API_PORT,
    'auditor/start-static-auditor.json',
);

const DYNAMIC_AUDITOR_ENDPOINT = buildAuditorUrl(
    process.env.V6Y_DYNAMIC_ANALYZER_API_PATH,
    process.env.V6Y_DYNAMIC_ANALYZER_API_PORT,
    'auditor/start-dynamic-auditor.json',
);

const DEVOPS_AUDITOR_ENDPOINT = buildAuditorUrl(
    process.env.V6Y_DEVOPS_API_PATH || process.env.V6Y_DEVOPS_ANALYSER_API_PATH,
    process.env.V6Y_DEVOPS_API_PORT,
    'auditor/start-devops-auditor.json',
);

// Log environment variables for debugging
AppLogger.debug('[ServerConfig] Environment variables:');
AppLogger.debug(`  V6Y_STATIC_ANALYZER_API_PATH: ${process.env.V6Y_STATIC_ANALYZER_API_PATH}`);
AppLogger.debug(`  V6Y_STATIC_ANALYZER_API_PORT: ${process.env.V6Y_STATIC_ANALYZER_API_PORT}`);
AppLogger.debug(`  V6Y_DYNAMIC_ANALYZER_API_PATH: ${process.env.V6Y_DYNAMIC_ANALYZER_API_PATH}`);
AppLogger.debug(`  V6Y_DYNAMIC_ANALYZER_API_PORT: ${process.env.V6Y_DYNAMIC_ANALYZER_API_PORT}`);
AppLogger.debug(`  V6Y_DEVOPS_API_PATH: ${process.env.V6Y_DEVOPS_API_PATH}`);
AppLogger.debug(`  V6Y_DEVOPS_ANALYSER_API_PATH: ${process.env.V6Y_DEVOPS_ANALYSER_API_PATH}`);
AppLogger.debug(`  V6Y_DEVOPS_API_PORT: ${process.env.V6Y_DEVOPS_API_PORT}`);
AppLogger.debug('[ServerConfig] Constructed URLs:');
AppLogger.debug(`  STATIC_AUDITOR_ENDPOINT: ${STATIC_AUDITOR_ENDPOINT}`);
AppLogger.debug(`  DYNAMIC_AUDITOR_ENDPOINT: ${DYNAMIC_AUDITOR_ENDPOINT}`);
AppLogger.debug(`  DEVOPS_AUDITOR_ENDPOINT: ${DEVOPS_AUDITOR_ENDPOINT}`);

const SERVER_ENV_CONFIGURATION = {
    production: {
        ssl: false,
        port: parseInt(process.env.V6Y_MAIN_API_PORT || '4002', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_MAIN_API_PATH,
        staticAuditorApiPath: STATIC_AUDITOR_ENDPOINT,
        dynamicAuditorApiPath: DYNAMIC_AUDITOR_ENDPOINT,
        devopsAuditorApiPath: DEVOPS_AUDITOR_ENDPOINT,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
        serverTimeout: 900000, // milliseconds
    },
    development: {
        ssl: false,
        port: parseInt(process.env.V6Y_MAIN_API_PORT || '4002', 10),
        hostname: 'localhost',
        apiPath: process.env.V6Y_MAIN_API_PATH,
        staticAuditorApiPath: STATIC_AUDITOR_ENDPOINT,
        dynamicAuditorApiPath: DYNAMIC_AUDITOR_ENDPOINT,
        devopsAuditorApiPath: DEVOPS_AUDITOR_ENDPOINT,
        healthCheckPath: V6Y_HEALTH_CHECK_PATH,
        monitoringPath: V6Y_MONITORING_PATH,
        databaseUri: '',
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

import AppLogger from '../core/AppLogger.ts';
import { ServerConfigType, ServerEnvConfigType } from '../types/ServerConfigType.ts';

/**
 * CORS options
 */
export const CorsOptions = {
    origin: function (
        origin: string | undefined,
        callback: (err: Error | null, origin?: string) => void,
    ) {
        AppLogger.debug(`[getServerConfig] CORS origin redirect: ${origin}`);
        callback(null, origin);
    },
};

/**
 * Get server configuration
 * @param SERVER_ENV_CONFIGURATION
 */
export const getServerConfig = (
    SERVER_ENV_CONFIGURATION: ServerEnvConfigType,
): ServerConfigType => {
    const execEnv = process?.argv;
    const currentContext = execEnv?.includes('--dev') ? 'development' : 'production';

    AppLogger.info(`[getServerConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${
            currentConfig.hostname
        }:${currentConfig.port}${currentConfig.apiPath}`,
    };
};

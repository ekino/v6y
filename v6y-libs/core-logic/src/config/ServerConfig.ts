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
        if (origin) {
            AppLogger.debug(`[getServerConfig] CORS origin redirect: ${origin}`);
        }
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
    // Check multiple sources for dev mode detection:
    // 1. NODE_ENV environment variable (most reliable)
    // 2. --dev command line flag (for backward compatibility)
    const nodeEnv = process.env.NODE_ENV;
    const execEnv = process?.argv;
    const hasDevFlag = execEnv?.includes('--dev');

    const currentContext = nodeEnv === 'development' || hasDevFlag ? 'development' : 'production';

    AppLogger.info(`[getServerConfig] NODE_ENV: ${nodeEnv}`);
    AppLogger.info(`[getServerConfig] process.argv: ${JSON.stringify(execEnv)}`);
    AppLogger.info(`[getServerConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${
            currentConfig.hostname
        }:${currentConfig.port}${currentConfig.apiPath}`,
    };
};

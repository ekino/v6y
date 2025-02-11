import AppLogger from '../core/AppLogger.ts';
import { ServerConfigType, ServerEnvConfigType } from '../types/ServerConfigType.ts';

export const getServerConfig = (
    SERVER_ENV_CONFIGURATION: ServerEnvConfigType,
): ServerConfigType => {
    const execEnv = process?.argv;
    const currentContext = execEnv?.includes('--dev') ? 'development' : 'production';

    const CorsOptions = {
        origin: function (
            origin: string | undefined,
            callback: (err: Error | null, origin?: string) => void,
        ) {
            AppLogger.debug(`[getServerConfig] CORS origin redirect: ${origin}`);
            callback(null, origin);
        },
    };

    AppLogger.info(`[getServerConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${
            currentConfig.hostname
        }:${currentConfig.port}${currentConfig.apiPath}`,
        corsOptions: CorsOptions,
    };
};

import AppLogger from '../core/AppLogger.ts';
import { ServerConfigType, ServerEnvConfigType } from '../types/ServerConfigType.ts';
import { getEnvironmentContext } from './getEnvironmentContext.ts';

export const getServerConfig = (
    SERVER_ENV_CONFIGURATION: ServerEnvConfigType,
): ServerConfigType => {
    const currentContext = getEnvironmentContext();
    AppLogger.info(`[getCurrentConfig] currentContext: ${currentContext}`);

    const currentConfig = SERVER_ENV_CONFIGURATION[currentContext];
    return {
        ...(currentConfig || {}),
        serverUrl: `http${currentConfig.ssl ? 's' : ''}://${
            currentConfig.hostname
        }:${currentConfig.port}${currentConfig.apiPath}`,
    };
};

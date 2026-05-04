import { AppLogger, ApplicationProvider } from '@v6y/core-logic';

import ServerConfig from '../../config/ServerConfig.ts';

const { currentConfig } = ServerConfig;

/**
 * Reads the SonarQube URL and token from the database (bff already has DB access),
 * then delegates the actual SonarQube API calls to the bfb-dynamic-auditor service.
 * The token is never forwarded to the frontend.
 */
const getSonarQubeMetrics = async (_: unknown, args: { _id: number }) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[SonarQubeMetricsResolvers - getSonarQubeMetrics] _id: ${_id}`);

        const { sonarqubeAuditorApiPath } = currentConfig || {};

        if (!sonarqubeAuditorApiPath) {
            AppLogger.error(
                '[SonarQubeMetricsResolvers - getSonarQubeMetrics] sonarqubeAuditorApiPath is not configured',
            );
            return { success: false, error: 'SonarQube auditor service is not configured' };
        }

        // Resolve the app's SonarQube URL and token from the DB here in bff
        const appDetails = await ApplicationProvider.getApplicationDetailsInfoByParams({ _id });
        if (!appDetails) {
            return { success: false, error: 'Application not found' };
        }

        const sonarUrl =
            appDetails.links?.find((l) => l?.label === 'Application SonarQube url')?.value ||
            appDetails.links?.find((l) => l?.label === 'Application code quality platform url')
                ?.value;

        if (!sonarUrl) {
            return { success: false, error: 'No SonarQube URL configured for this application' };
        }

        // Token is kept server-side — never returned to the client
        const token = appDetails.configuration?.sonarqube?.token;

        const response = await fetch(`${sonarqubeAuditorApiPath}/get-sonarqube-metrics.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sonarUrl, token }),
        });

        if (!response.ok) {
            AppLogger.error(
                `[SonarQubeMetricsResolvers - getSonarQubeMetrics] auditor responded with status ${response.status}`,
            );
            return {
                success: false,
                error: `SonarQube auditor returned an unexpected error (${response.status})`,
            };
        }

        return response.json();
    } catch (error) {
        AppLogger.info(`[SonarQubeMetricsResolvers - getSonarQubeMetrics] error: ${error}`);
        return { success: false, error: String(error) };
    }
};

const SonarQubeMetricsResolvers = {
    getSonarQubeMetrics,
};

export default SonarQubeMetricsResolvers;

import { AccountType, AppLogger, ApplicationProvider } from '@v6y/core-logic';

const METRIC_KEYS = [
    'coverage',
    'bugs',
    'vulnerabilities',
    'code_smells',
    'duplicated_lines_density',
    'reliability_rating',
    'security_rating',
    'sqale_rating',
    'alert_status',
    'ncloc',
    'lines',
].join(',');

const METRIC_LABELS: Record<string, string> = {
    coverage: 'Code Coverage',
    bugs: 'Bugs',
    vulnerabilities: 'Vulnerabilities',
    code_smells: 'Code Smells',
    duplicated_lines_density: 'Duplications',
    reliability_rating: 'Reliability Rating',
    security_rating: 'Security Rating',
    sqale_rating: 'Maintainability Rating',
    alert_status: 'Quality Gate',
    ncloc: 'Lines of Code',
    lines: 'Total Lines',
};

const RATING_LABELS: Record<string, string> = {
    '1': 'A',
    '2': 'B',
    '3': 'C',
    '4': 'D',
    '5': 'E',
};

/**
 * Fetch SonarQube metrics for a given application (server-side only, token never exposed)
 */
const getSonarQubeMetrics = async (
    _: unknown,
    args: { _id: number },
    { user }: { user: AccountType },
) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[SonarQubeMetrics - getSonarQubeMetrics] _id: ${_id}`);

        const appDetails = await ApplicationProvider.getApplicationDetailsInfoByParams({ _id });
        if (!appDetails) {
            return { success: false, error: 'Application not found' };
        }

        // Extract sonarqube URL from links
        const sonarUrl =
            appDetails.links?.find((l) => l?.label === 'Application SonarQube url')?.value ||
            appDetails.links?.find((l) => l?.label === 'Application code quality platform url')
                ?.value;

        if (!sonarUrl) {
            return { success: false, error: 'No SonarQube URL configured for this application' };
        }

        // Extract token from configuration (never exposed to frontend)
        const token = appDetails.configuration?.sonarqube?.token;

        // Extract project key and base URL
        let projectKey: string | null = null;
        let baseUrl: string = '';
        try {
            const urlObj = new URL(sonarUrl);
            baseUrl = urlObj.origin;
            projectKey =
                urlObj.searchParams.get('id') ||
                urlObj.searchParams.get('project') ||
                urlObj.searchParams.get('projectKey');
        } catch {
            return { success: false, error: 'Invalid SonarQube URL format' };
        }

        if (!projectKey) {
            return {
                success: false,
                error: 'Could not extract project key from SonarQube URL (missing ?id= parameter)',
            };
        }

        const headers: Record<string, string> = {
            Accept: 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch measures
        const measuresUrl = `${baseUrl}/api/measures/component?component=${encodeURIComponent(projectKey)}&metricKeys=${METRIC_KEYS}`;
        AppLogger.info(`[SonarQubeMetrics] Fetching measures from: ${measuresUrl}`);

        const measuresRes = await fetch(measuresUrl, { headers });
        if (!measuresRes.ok) {
            const errText = await measuresRes.text().catch(() => measuresRes.statusText);
            AppLogger.info(
                `[SonarQubeMetrics] measures fetch failed: ${measuresRes.status} ${errText}`,
            );
            return {
                success: false,
                error: `SonarQube API returned ${measuresRes.status}: ${token ? 'check token permissions' : 'project may be private — add a token'}`,
            };
        }
        const measuresData = await measuresRes.json();

        // Fetch quality gate status
        const qgUrl = `${baseUrl}/api/qualitygates/project_status?projectKey=${encodeURIComponent(projectKey)}`;
        AppLogger.info(`[SonarQubeMetrics] Fetching quality gate from: ${qgUrl}`);

        const qgRes = await fetch(qgUrl, { headers });
        let qualityGate = null;
        if (qgRes.ok) {
            const qgData = await qgRes.json();
            qualityGate = {
                status: qgData?.projectStatus?.status || 'NONE',
                name: 'Sonar Way',
            };
        }

        // Format metrics
        const rawMeasures: { metric: string; value: string }[] =
            measuresData?.component?.measures || [];

        const metrics = rawMeasures.map((m) => {
            const isRating = m.metric.endsWith('_rating');
            return {
                key: m.metric,
                name: METRIC_LABELS[m.metric] || m.metric,
                value: isRating ? RATING_LABELS[m.value] || m.value : m.value,
                rating: isRating ? RATING_LABELS[m.value] || null : null,
            };
        });

        return {
            success: true,
            projectKey,
            baseUrl,
            qualityGate,
            metrics,
            error: null,
        };
    } catch (error) {
        AppLogger.info(`[SonarQubeMetrics - getSonarQubeMetrics] error: ${error}`);
        return { success: false, error: String(error) };
    }
};

const SonarQubeMetricsResolvers = {
    getSonarQubeMetrics,
};

export default SonarQubeMetricsResolvers;

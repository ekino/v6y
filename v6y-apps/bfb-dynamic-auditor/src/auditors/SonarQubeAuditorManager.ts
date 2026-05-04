import { AppLogger } from '@v6y/core-logic';

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

export interface SonarQubeMetricResult {
    key: string;
    name: string;
    value: string | null;
    rating: string | null;
}

export interface SonarQubeQualityGate {
    status: string;
    name: string;
}

export interface SonarQubeMetricsResult {
    success: boolean;
    projectKey?: string | null;
    baseUrl?: string | null;
    qualityGate?: SonarQubeQualityGate | null;
    metrics?: SonarQubeMetricResult[];
    error?: string | null;
}

/**
 * Fetches SonarQube metrics by calling the SonarQube API directly.
 * The sonarUrl and token are provided by the caller (bff), which reads them
 * from the database. This service has no database dependency.
 */
const getSonarQubeMetrics = async ({
    sonarUrl,
    token,
}: {
    sonarUrl: string;
    token?: string | null;
}): Promise<SonarQubeMetricsResult> => {
    try {
        AppLogger.info(`[SonarQubeAuditorManager - getSonarQubeMetrics] sonarUrl: ${sonarUrl}`);

        // Parse project key and base URL from the configured SonarQube URL
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

        // Fetch component measures from SonarQube API
        const measuresUrl = `${baseUrl}/api/measures/component?component=${encodeURIComponent(projectKey)}&metricKeys=${METRIC_KEYS}`;
        AppLogger.info(
            `[SonarQubeAuditorManager - getSonarQubeMetrics] Fetching measures from: ${measuresUrl}`,
        );

        const measuresRes = await fetch(measuresUrl, { headers });
        if (!measuresRes.ok) {
            const errText = await measuresRes.text().catch(() => measuresRes.statusText);
            AppLogger.info(
                `[SonarQubeAuditorManager - getSonarQubeMetrics] measures fetch failed: ${measuresRes.status} ${errText}`,
            );
            return {
                success: false,
                error: `SonarQube API returned ${measuresRes.status}: ${token ? 'check token permissions' : 'project may be private — add a token'}`,
            };
        }
        const measuresData = (await measuresRes.json()) as {
            component?: { measures?: { metric: string; value: string }[] };
        };

        // Fetch quality gate status from SonarQube API
        const qgUrl = `${baseUrl}/api/qualitygates/project_status?projectKey=${encodeURIComponent(projectKey)}`;
        AppLogger.info(
            `[SonarQubeAuditorManager - getSonarQubeMetrics] Fetching quality gate from: ${qgUrl}`,
        );

        const qgRes = await fetch(qgUrl, { headers });
        let qualityGate: SonarQubeQualityGate | null = null;
        if (qgRes.ok) {
            const qgData = (await qgRes.json()) as {
                projectStatus?: { status?: string };
            };
            qualityGate = {
                status: qgData?.projectStatus?.status || 'NONE',
                name: 'Sonar Way',
            };
        }

        // Format raw measures into a structured result
        const rawMeasures: { metric: string; value: string }[] =
            measuresData?.component?.measures || [];

        const metrics: SonarQubeMetricResult[] = rawMeasures.map((m) => {
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
        AppLogger.info(`[SonarQubeAuditorManager - getSonarQubeMetrics] error: ${String(error)}`);
        return { success: false, error: String(error) };
    }
};

const SonarQubeAuditorManager = {
    getSonarQubeMetrics,
};

export default SonarQubeAuditorManager;

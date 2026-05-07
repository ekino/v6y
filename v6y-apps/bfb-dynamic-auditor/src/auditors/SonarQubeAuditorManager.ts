import {
    AppLogger,
    ApplicationProvider,
    AuditProvider,
    AuditType,
    auditStatus,
    scoreStatus,
} from '@v6y/core-logic';

import { AuditCommonsType } from './types/AuditCommonsType.ts';

const METRIC_KEYS = [
    'coverage',
    'bugs',
    'vulnerabilities',
    'code_smells',
    'duplicated_lines_density',
    'reliability_rating',
    'security_rating',
    'sqale_rating',
    'ncloc',
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
    ncloc: 'Lines of Code',
};

const RATING_LABELS: Record<string, string> = {
    '1': 'A',
    '2': 'B',
    '3': 'C',
    '4': 'D',
    '5': 'E',
};

const PERCENTAGE_METRICS = new Set(['coverage', 'duplicated_lines_density']);
const RATING_METRICS = new Set(['reliability_rating', 'security_rating', 'sqale_rating']);

const computeScoreStatus = (metricKey: string, value: string): string => {
    const n = parseFloat(value);
    if (isNaN(n)) return scoreStatus.info;

    if (RATING_METRICS.has(metricKey)) {
        const rating = Math.round(n);
        if (rating <= 1) return scoreStatus.success;
        if (rating === 2) return scoreStatus.info;
        if (rating === 3) return scoreStatus.warning;
        return scoreStatus.error;
    }

    switch (metricKey) {
        case 'coverage':
            return n >= 80
                ? scoreStatus.success
                : n >= 50
                  ? scoreStatus.warning
                  : scoreStatus.error;
        case 'duplicated_lines_density':
            return n < 3 ? scoreStatus.success : n < 10 ? scoreStatus.warning : scoreStatus.error;
        case 'bugs':
        case 'vulnerabilities':
            return n === 0 ? scoreStatus.success : n <= 5 ? scoreStatus.warning : scoreStatus.error;
        case 'code_smells':
            return n === 0
                ? scoreStatus.success
                : n <= 10
                  ? scoreStatus.warning
                  : scoreStatus.error;
        default:
            return scoreStatus.info;
    }
};

const computeQualityGateScoreStatus = (status: string): string => {
    switch (status) {
        case 'OK':
            return scoreStatus.success;
        case 'WARN':
            return scoreStatus.warning;
        case 'ERROR':
            return scoreStatus.error;
        default:
            return scoreStatus.info;
    }
};

const parseSonarqubeUrl = (sonarUrl: string): { projectKey: string; baseUrl: string } | null => {
    try {
        const urlObj = new URL(sonarUrl);
        const projectKey =
            urlObj.searchParams.get('id') ||
            urlObj.searchParams.get('project') ||
            urlObj.searchParams.get('projectKey');
        if (!projectKey) return null;
        return { projectKey, baseUrl: urlObj.origin };
    } catch {
        return null;
    }
};

const fetchSonarQubeData = async (
    baseUrl: string,
    projectKey: string,
    headers: Record<string, string>,
): Promise<{
    rawMeasures: { metric: string; value: string }[];
    qualityGateStatus: string;
} | null> => {
    const measuresUrl = `${baseUrl}/api/measures/component?component=${encodeURIComponent(projectKey)}&metricKeys=${METRIC_KEYS}`;
    AppLogger.info(
        `[SonarQubeAuditorManager - fetchSonarQubeData] fetching measures: ${measuresUrl}`,
    );

    const measuresRes = await fetch(measuresUrl, { headers });
    if (!measuresRes.ok) {
        AppLogger.info(
            `[SonarQubeAuditorManager - fetchSonarQubeData] measures fetch failed: ${measuresRes.status}`,
        );
        return null;
    }
    const measuresData = (await measuresRes.json()) as {
        component?: { measures?: { metric: string; value: string }[] };
    };

    const qgUrl = `${baseUrl}/api/qualitygates/project_status?projectKey=${encodeURIComponent(projectKey)}`;
    AppLogger.info(
        `[SonarQubeAuditorManager - fetchSonarQubeData] fetching quality gate: ${qgUrl}`,
    );

    const qgRes = await fetch(qgUrl, { headers });
    let qualityGateStatus = 'NONE';
    if (qgRes.ok) {
        const qgData = (await qgRes.json()) as { projectStatus?: { status?: string } };
        qualityGateStatus = qgData?.projectStatus?.status || 'NONE';
    }

    return { rawMeasures: measuresData?.component?.measures || [], qualityGateStatus };
};

/**
 * Fetches SonarQube metrics for an application and persists them as AuditType records in the DB.
 * Follows the same batch auditor pattern as LighthouseAuditor.
 */
const startAuditorAnalysis = async ({ applicationId }: AuditCommonsType): Promise<boolean> => {
    try {
        AppLogger.info(
            `[SonarQubeAuditorManager - startAuditorAnalysis] applicationId: ${applicationId}`,
        );

        if (applicationId === undefined) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application?._id) {
            AppLogger.info(
                `[SonarQubeAuditorManager - startAuditorAnalysis] application not found`,
            );
            return false;
        }

        const sonarUrl =
            application.links?.find((l) => l?.label === 'Application SonarQube url')?.value ||
            application.links?.find((l) => l?.label === 'Application code quality platform url')
                ?.value;

        if (!sonarUrl) {
            AppLogger.info(
                `[SonarQubeAuditorManager - startAuditorAnalysis] no SonarQube URL configured`,
            );
            return false;
        }

        const parsed = parseSonarqubeUrl(sonarUrl);
        if (!parsed) {
            AppLogger.info(
                `[SonarQubeAuditorManager - startAuditorAnalysis] invalid or missing project key in URL: ${sonarUrl}`,
            );
            return false;
        }
        const { projectKey, baseUrl } = parsed;

        const token = application.configuration?.sonarqube?.token;
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const sonarData = await fetchSonarQubeData(baseUrl, projectKey, headers);
        if (!sonarData) {
            return false;
        }
        const { rawMeasures, qualityGateStatus } = sonarData;

        // Map metrics to AuditType records
        const auditReports: AuditType[] = [];

        // Quality gate record — also carries projectKey/baseUrl in extraInfos for the front
        auditReports.push({
            type: 'sonarqube',
            category: 'quality_gate',
            subCategory: qualityGateStatus,
            auditStatus: auditStatus.success,
            score: null,
            scoreStatus: computeQualityGateScoreStatus(qualityGateStatus),
            scoreUnit: '',
            extraInfos: JSON.stringify({ name: 'Sonar Way', projectKey, baseUrl }),
            module: { appId: applicationId },
        });

        // Individual metric records
        for (const m of rawMeasures) {
            const isRating = RATING_METRICS.has(m.metric);
            const numericValue = parseFloat(m.value);
            auditReports.push({
                type: 'sonarqube',
                category: m.metric,
                subCategory: isRating ? RATING_LABELS[m.value] || undefined : undefined,
                auditStatus: auditStatus.success,
                score: isNaN(numericValue) ? null : numericValue,
                scoreStatus: computeScoreStatus(m.metric, m.value),
                scoreUnit: PERCENTAGE_METRICS.has(m.metric) ? '%' : '',
                extraInfos: JSON.stringify({ name: METRIC_LABELS[m.metric] || m.metric }),
                module: { appId: applicationId },
            });
        }

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[SonarQubeAuditorManager - startAuditorAnalysis] ${auditReports.length} audit records inserted`,
        );

        return true;
    } catch (error) {
        AppLogger.info(`[SonarQubeAuditorManager - startAuditorAnalysis] error: ${String(error)}`);
        return false;
    }
};

const SonarQubeAuditorManager = {
    startAuditorAnalysis,
};

export default SonarQubeAuditorManager;

import {
    AppLogger,
    ApplicationProvider,
    AuditProvider,
    MonitoringApi,
    RepositoryApi,
} from '@v6y/core-logic';

import { AuditOutcome } from '../types/AuditCommonsType.ts';
import {
    DoraMetricsAuditConfigType,
    startDoraMetricsAnalysisParamsType,
} from '../types/DoraMetricsAuditType.ts';
import DoraMetricsConfig from './DoraMetricsConfig.ts';
import DoraMetricsUtils from './DoraMetricsUtils.ts';

const { analyseDoraMetrics } = DoraMetricsUtils;

/**
 * Starts the Dora Metrics auditor analysis.
 * @param auditConfig
 */
const startAuditorAnalysis = async ({
    applicationId,
    auditRunId,
}: DoraMetricsAuditConfigType): Promise<AuditOutcome> => {
    try {
        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );
        AppLogger.info(`[DoraMetricsAuditor - startAuditorAnalysis] auditRunId:  ${auditRunId}`);

        if (applicationId === undefined) {
            return { status: 'failed', message: 'The applicationId is required.' };
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application?._id) {
            return { status: 'failed', message: `Unknown application ${applicationId}.` };
        }

        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );

        // DORA metrics are computed from GitLab-only endpoints
        // (projects/:id/deployments and /merge_requests). GithubConfig exposes no
        // equivalent, and startDoraMetricsAnalysis below fetches with the default
        // 'gitlab' type, so resolving a GitHub repository id would query GitLab with a
        // GitHub id: every request fails, and empty metrics get reported as a success.
        // Skip explicitly instead, until GitHub DORA endpoints actually exist.
        if (application.repo?.webUrl?.includes('github.com')) {
            AppLogger.warn(
                `[DoraMetricsAuditor - startAuditorAnalysis] GitHub-hosted repository, skipping Dora metrics audit`,
            );
            return {
                status: 'skipped',
                message: 'DORA metrics are only available for GitLab-hosted repositories.',
            };
        }

        const repositoryDetails = await RepositoryApi.getRepositoryDetails({
            organization: application.repo?.organization,
            gitRepositoryName: application.repo?.gitUrl?.split('/').pop()?.replace('.git', ''),
            type: 'gitlab',
        });

        if (!repositoryDetails?.id) {
            // Not a failure: a project with no resolvable GitLab id simply has nothing
            // to audit here.
            AppLogger.warn(
                `[DoraMetricsAuditor - startAuditorAnalysis] repository id is missing, skipping Dora metrics audit`,
            );
            return {
                status: 'skipped',
                message: 'No GitLab repository id resolved; DORA metrics audit skipped.',
            };
        }

        const auditReports = [];
        const dateEnd = new Date();

        const { AUDIT_RANGES } = DoraMetricsConfig;

        for (const range of AUDIT_RANGES) {
            const dateStart = new Date(dateEnd);
            dateStart.setDate(dateStart.getDate() - range);
            const reports = await startDoraMetricsAnalysis({
                application,
                repositoryDetails,
                dateStart,
                dateEnd,
            });
            auditReports.push(...reports);
        }

        // Add auditRunId to each report
        if (auditRunId) {
            const auditRunIdNum =
                typeof auditRunId === 'string' ? parseInt(auditRunId, 10) : auditRunId;
            auditReports.forEach((audit) => {
                audit.auditRunId = auditRunIdNum;
            });
        }

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );

        return { status: 'success' };
    } catch (error) {
        AppLogger.error(
            '[DoraMetricsAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return { status: 'failed', message: String(error) };
    }
};

/**
 * Starts the Dora Metrics analysis.
 * @param application
 * @param repositoryDetails
 * @param dateStartStr
 * @param dateEndStr
 */
const startDoraMetricsAnalysis = async ({
    application,
    repositoryDetails,
    dateStart,
    dateEnd,
}: startDoraMetricsAnalysisParamsType) => {
    if (!repositoryDetails?.id) {
        AppLogger.warn(`[DoraMetricsAuditor - startAuditorAnalysis] repository id is missing`);
        return [];
    }

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] Starting Analysis for date range : ${dateStart} - ${dateEnd}`,
    );

    const mergeRequests = await RepositoryApi.getRepositoryMergeRequests({
        organization: application.repo?.organization,
        repositoryId: repositoryDetails?.id,
        dateStart,
        dateEnd,
    });

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] mergeRequests:  ${mergeRequests?.length}`,
    );

    const deployments = await RepositoryApi.getRepositoryDeployments({
        organization: application.repo?.organization,
        repositoryId: repositoryDetails?.id,
        dateStart: dateStart,
        dateEnd: dateEnd,
    });

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] deployments:  ${deployments?.length}`,
    );

    const monitoringEvents = await MonitoringApi.getMonitoringEvents({
        application,
        dateStart,
        dateEnd,
    });

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] events:  ${monitoringEvents?.length}`,
    );

    return analyseDoraMetrics({
        deployments: deployments || [],
        mergeRequests: mergeRequests || [],
        monitoringEvents: monitoringEvents || [],
        application,
        dateStart,
        dateEnd,
    });
};

const DoraMetricsAuditor = {
    startAuditorAnalysis,
};

export default DoraMetricsAuditor;

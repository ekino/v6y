import {
    AppLogger,
    ApplicationProvider,
    AuditProvider,
    MonitoringApi,
    RepositoryApi,
} from '@v6y/core-logic';

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
const startAuditorAnalysis = async ({ applicationId }: DoraMetricsAuditConfigType) => {
    try {
        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] applicationId:  ${applicationId}`,
        );

        if (applicationId === undefined) {
            return false;
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application?._id) {
            return false;
        }

        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] application _id:  ${application?._id}`,
        );
        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] application.repo:  ${JSON.stringify(application?.repo)}`,
        );
        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] organization:  ${application.repo?.organization}`,
        );
        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] gitUrl:  ${application.repo?.gitUrl}`,
        );

        const gitUrlParts = application.repo?.gitUrl?.replace('.git', '').split('/');
        const projectPath = gitUrlParts?.slice(-2).join('/');

        AppLogger.info(`[DoraMetricsAuditor - startAuditorAnalysis] projectPath:  ${projectPath}`);

        if (!projectPath) {
            AppLogger.error(`[DoraMetricsAuditor - startAuditorAnalysis] project path is missing`);
            return false;
        }

        const auditReports = [];
        const dateEnd = new Date();

        const { AUDIT_RANGES } = DoraMetricsConfig;

        for (const range of AUDIT_RANGES) {
            const dateStart = new Date(dateEnd);
            dateStart.setDate(dateStart.getDate() - range);
            const reports = await startDoraMetricsAnalysis({
                application,
                projectPath,
                dateStart,
                dateEnd,
            });
            auditReports.push(...reports);
        }

        await AuditProvider.insertAuditList(auditReports);

        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] audit reports inserted successfully`,
        );

        return true;
    } catch (error) {
        AppLogger.error(
            '[DoraMetricsAuditor - startAuditorAnalysis] An exception occurred during the audits:',
            error,
        );
        return false;
    }
};

/**
 * Starts the Dora Metrics analysis.
 * @param application
 * @param projectPath
 * @param dateStart
 * @param dateEnd
 */
const startDoraMetricsAnalysis = async ({
    application,
    projectPath,
    dateStart,
    dateEnd,
}: startDoraMetricsAnalysisParamsType) => {
    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] Starting Analysis for date range : ${dateStart} - ${dateEnd}`,
    );

    const mergeRequestsData = await RepositoryApi.getRepositoryMergeRequests({
        organization: application.repo?.organization,
        projectPath,
        dateStart,
        dateEnd,
    });
    const mergeRequests = Array.isArray(mergeRequestsData) ? mergeRequestsData : [];

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] mergeRequests:  ${mergeRequests?.length}`,
    );

    const deploymentsData = await RepositoryApi.getRepositoryDeployments({
        organization: application.repo?.organization,
        projectPath,
        dateStart: dateStart,
        dateEnd: dateEnd,
    });
    const deployments = Array.isArray(deploymentsData) ? deploymentsData : [];

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] deployments:  ${deployments?.length}`,
    );

    const monitoringEventsData = await MonitoringApi.getMonitoringEvents({
        application,
        dateStart,
        dateEnd,
    });
    const monitoringEvents = Array.isArray(monitoringEventsData) ? monitoringEventsData : [];

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

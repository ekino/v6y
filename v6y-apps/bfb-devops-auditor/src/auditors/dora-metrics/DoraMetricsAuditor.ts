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

        const repositoryDetails = await RepositoryApi.getRepositoryDetails({
            organization: application.repo?.organization,
            gitRepositoryName: application.repo?.gitUrl?.split('/').pop()?.replace('.git', ''),
            type: 'gitlab',
        });

        if (!repositoryDetails?.id) {
            AppLogger.error(`[DoraMetricsAuditor - startAuditorAnalysis] repository id is missing`);
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
                repositoryDetails,
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
        AppLogger.error(`[DoraMetricsAuditor - startAuditorAnalysis] repository id is missing`);
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

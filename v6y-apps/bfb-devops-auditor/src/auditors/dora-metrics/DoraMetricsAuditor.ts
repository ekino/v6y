import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    AuditProvider,
    RepositoryApi,
    RepositoryType,
} from '@v6y/core-logic';

import { DoraMetricsAuditConfigType } from '../types/DoraMetricsAuditType.ts';
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
            `[DoraMetricsAuditor - startAuditorAnalysis] application repo:  ${JSON.stringify(application?.repo)}`,
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
        const testRanges = [30]; // 30 days, 60 days, 1 year
        const dateEndStr = new Date('2025-02-20').toISOString().split('T')[0]; // Today's date

        for (const range of testRanges) {
            const dateStart = new Date(dateEndStr);
            dateStart.setDate(dateStart.getDate() - range);
            const dateStartStr = dateStart.toISOString().split('T')[0];
            const reports = await startDoraMetricsAnalysis({
                application,
                repositoryDetails,
                dateStartStr,
                dateEndStr,
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

export interface startDoraMetricsAnalysisOptions {
    application: ApplicationType;
    repositoryDetails: RepositoryType;
    dateStartStr: string;
    dateEndStr: string;
}

const startDoraMetricsAnalysis = async ({
    application,
    repositoryDetails,
    dateStartStr,
    dateEndStr,
}: startDoraMetricsAnalysisOptions) => {
    if (!repositoryDetails?.id) {
        AppLogger.error(`[DoraMetricsAuditor - startAuditorAnalysis] repository id is missing`);
        return [];
    }

    const mergeRequests = await RepositoryApi.getRepositoryMergeRequests({
        organization: application.repo?.organization,
        repositoryId: repositoryDetails?.id,
        startDate: dateStartStr,
        endDate: dateEndStr,
    });

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] mergeRequests:  ${mergeRequests?.length}`,
    );

    const deployments = await RepositoryApi.getRepositoryDeployments({
        organization: application.repo?.organization,
        repositoryId: repositoryDetails?.id,
        startDate: dateStartStr,
        endDate: dateEndStr,
    });

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] deployments:  ${deployments?.length}`,
    );

    return analyseDoraMetrics({
        deployments: deployments || [],
        mergeRequests: mergeRequests || [],
        application,
        dateStart: dateStartStr,
        dateEnd: dateEndStr,
    });
};

const DoraMetricsAuditor = {
    startAuditorAnalysis,
};

export default DoraMetricsAuditor;

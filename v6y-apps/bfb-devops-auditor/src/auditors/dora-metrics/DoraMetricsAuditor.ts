import {
    AppLogger,
    ApplicationProvider,
    ApplicationType,
    AuditProvider,
    DateUtils,
    RepositoryApi,
    RepositoryType,
} from '@v6y/core-logic';

import { DoraMetricsAuditConfigType } from '../types/DoraMetricsAuditType.ts';
import DoraMetricsConfig from './DoraMetricsConfig.ts';
import DoraMetricsUtils from './DoraMetricsUtils.ts';
import mockDatadogEvents from './mockDataDogEventsData.json' with { type: 'json' };

const { analyseDoraMetrics } = DoraMetricsUtils;

const { formatDateToString, formatStringToDate } = DateUtils;

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
        const dateEndStr = formatDateToString(new Date(), 'YYYY-MM-DD');

        const { AUDIT_RANGES } = DoraMetricsConfig;

        for (const range of AUDIT_RANGES) {
            const dateStart = formatStringToDate(dateEndStr);
            dateStart.setDate(dateStart.getDate() - range);
            const dateStartStr = formatDateToString(dateStart, 'YYYY-MM-DD');
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

    // Mocked data while the DataDog API integration is not yet implemented
    const dataDogEvents = mockDatadogEvents;

    AppLogger.info(
        `[DoraMetricsAuditor - startAuditorAnalysis] dataDogEvents:  ${dataDogEvents?.data?.length}`,
    );

    return analyseDoraMetrics({
        deployments: deployments || [],
        mergeRequests: mergeRequests || [],
        dataDogEvents: dataDogEvents || [],
        application,
        dateStart: dateStartStr,
        dateEnd: dateEndStr,
    });
};

const DoraMetricsAuditor = {
    startAuditorAnalysis,
};

export default DoraMetricsAuditor;

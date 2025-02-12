import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/core-logic';

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

        const currentDate = new Date();
        const dateEnd = currentDate.toISOString().split('T')[0];

        const dateStartD30 = new Date(currentDate);
        dateStartD30.setDate(dateStartD30.getDate() - 30);
        const dateStartD30Str = dateStartD30.toISOString().split('T')[0];

        const dateStartD90 = new Date(currentDate);
        dateStartD90.setDate(dateStartD90.getDate() - 90);
        const dateStartD90Str = dateStartD90.toISOString().split('T')[0];

        const dateStartD365 = new Date(currentDate);
        dateStartD365.setDate(dateStartD365.getDate() - 365);
        const dateStartD365Str = dateStartD365.toISOString().split('T')[0];

        const auditReportsD30 = analyseDoraMetrics({
            deployments: [],
            mergeRequests: [],
            application,
            dateStart: dateStartD30Str,
            dateEnd,
        });

        const auditReportsD90 = analyseDoraMetrics({
            deployments: [],
            mergeRequests: [],
            application,
            dateStart: dateStartD90Str,
            dateEnd,
        });

        const auditReportsD365 = analyseDoraMetrics({
            deployments: [],
            mergeRequests: [],
            application,
            dateStart: dateStartD365Str,
            dateEnd,
        });

        const auditReports = [
            ...(auditReportsD30 || []),
            ...(auditReportsD90 || []),
            ...(auditReportsD365 || []),
        ];

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

const DoraMetricsAuditor = {
    startAuditorAnalysis,
};

export default DoraMetricsAuditor;

import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/commons';

import DoraMetricsUtils from './DoraMetricsUtils.ts';
import { DoraMetricsAuditConfigType } from './types/DoraMetricsAuditType.ts';

const { formatDoraMetricsReport, computeDoraMetricsReport } = DoraMetricsUtils;

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

        // TODO: Implement the retrieval of deployments and commits from the APIs
        const report = computeDoraMetricsReport({
            deployments: [],
            commits: [],
        });

        const auditReport = formatDoraMetricsReport({ report, application });
        AppLogger.info(
            `[DoraMetricsAuditor - startAuditorAnalysis] auditReport: ${JSON.stringify(auditReport)}`,
        );

        await AuditProvider.createAudit(auditReport);

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

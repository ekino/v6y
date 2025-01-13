import { AppLogger, ApplicationProvider, AuditProvider } from '@v6y/core-logic';

import { DoraMetricsAuditConfigType } from '../types/DoraMetricsAuditType.ts';
import DoraMetricsUtils from './DoraMetricsUtils.ts';

const { formatDoraMetricsReports, computeDoraMetricsReport } = DoraMetricsUtils;

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

        const report = computeDoraMetricsReport({
            deployments: [],
            commits: [],
        });

        const auditReports = formatDoraMetricsReports({ report, application });

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

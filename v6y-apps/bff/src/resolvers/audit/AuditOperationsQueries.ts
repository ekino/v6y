import { AppLogger, AuditProvider } from '@v6y/core-logic';

/**
 * Get Application Audit Results by Application ID
 * @param _
 * @param args
 */
const getApplicationAuditResults = async (
    _: unknown,
    args: { applicationId: number; branch?: string },
) => {
    try {
        const { applicationId, branch } = args || {};

        AppLogger.info(
            `[AuditOperationsQueries - getApplicationAuditResults] applicationId : ${applicationId}`,
        );
        AppLogger.info(`[AuditOperationsQueries - getApplicationAuditResults] branch : ${branch}`);

        // Fetch audit results from database
        const auditResults = await AuditProvider.getAuditListByApplicationId(applicationId);

        AppLogger.info(
            `[AuditOperationsQueries - getApplicationAuditResults] auditResults count : ${auditResults?.length}`,
        );

        return auditResults || [];
    } catch (error) {
        AppLogger.error(`[AuditOperationsQueries - getApplicationAuditResults] error : ${error}`);
        return [];
    }
};

const AuditOperationsQueries = {
    getApplicationAuditResults,
};

export default AuditOperationsQueries;

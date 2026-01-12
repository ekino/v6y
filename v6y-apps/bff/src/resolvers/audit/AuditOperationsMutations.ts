import { AppLogger, ApplicationProvider } from '@v6y/core-logic';

/**
 * Trigger Application Audit via Main Analyzer
 * @param _
 * @param args
 */
const triggerApplicationAudit = async (
    _: unknown,
    args: { applicationId: number; branch?: string },
) => {
    try {
        const { applicationId, branch } = args || {};

        AppLogger.info(
            `[AuditOperationsMutations - triggerApplicationAudit] applicationId : ${applicationId}`,
        );
        AppLogger.info(`[AuditOperationsMutations - triggerApplicationAudit] branch : ${branch}`);

        // Get application details to validate it exists
        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: applicationId,
        });

        if (!application) {
            throw new Error(`Application with ID ${applicationId} not found`);
        }

        // Call main analyzer to trigger the audit
        const mainAnalyzerUrl = process.env.V6Y_MAIN_ANALYZER_URL || 'http://localhost:4005';
        const analyzeEndpoint = `${mainAnalyzerUrl}/analyze`;

        AppLogger.info(
            `[AuditOperationsMutations - triggerApplicationAudit] Calling main analyzer at: ${analyzeEndpoint}`,
        );

        const response = await fetch(analyzeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                applicationId,
                branch: branch || application.repo?.defaultBranch || 'main',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Main analyzer failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        AppLogger.info(
            `[AuditOperationsMutations - triggerApplicationAudit] Audit triggered successfully`,
        );

        return {
            success: true,
            message: 'Audit triggered successfully. Results will be available shortly.',
            data: JSON.stringify(result),
        };
    } catch (error) {
        AppLogger.error(`[AuditOperationsMutations - triggerApplicationAudit] error : ${error}`);
        return {
            success: false,
            message: `Failed to trigger audit: ${error instanceof Error ? error.message : 'Unknown error'}`,
            data: null,
        };
    }
};

const AuditOperationsMutations = {
    triggerApplicationAudit,
};

export default AuditOperationsMutations;

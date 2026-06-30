import { AppLogger, ApplicationProvider, AuditRunProvider } from '@v6y/core-logic';

import { buildDynamicReports, buildStaticReports } from './AuditManager.ts';

interface TriggerAuditParams {
    applicationId?: string | number;
    branch?: string;
    analysisTypes?: string[];
}

type AuditRun = Awaited<ReturnType<typeof AuditRunProvider.createAuditRun>>;

type TriggerAuditResult =
    | { status: 'triggered'; auditRun: AuditRun }
    | { status: 'invalid-application' }
    | { status: 'application-not-found' }
    | { status: 'creation-failed' }
    | { status: 'invalid-run-id' }
    | { status: 'error' };

interface ApplicationForAnalysis {
    _id: number;
    repo?: { allBranches?: string[] };
}

/**
 * Runs the actual audit jobs in the background. This is the fire-and-forget
 * seam where a BullMQ `queue.add()` will replace the inline execution.
 */
const runAnalysis = async ({
    application,
    branch,
    analysisTypes,
    auditRunId,
}: {
    application: ApplicationForAnalysis;
    branch?: string;
    analysisTypes?: string[];
    auditRunId: number;
}) => {
    try {
        const branchesToAnalyze = branch
            ? [{ name: branch }]
            : application?.repo?.allBranches?.map((b: string) => ({ name: b })) || [];

        if (analysisTypes?.includes('static') || !analysisTypes) {
            AppLogger.info(
                `[TriggerAuditManager - runAnalysis] Triggering static auditor for app ${application._id}`,
            );
            await buildStaticReports({
                application,
                branches: branchesToAnalyze,
                auditRunId: String(auditRunId),
            });
        }

        if (analysisTypes?.includes('dynamic') || !analysisTypes) {
            AppLogger.info(
                `[TriggerAuditManager - runAnalysis] Triggering dynamic auditor for app ${application._id}`,
            );
            await buildDynamicReports({
                application,
                auditRunId: String(auditRunId),
            });
        }

        await AuditRunProvider.updateAuditRunStatus({
            auditRunId,
            runStatus: 'completed',
            completedAt: new Date(),
        });

        AppLogger.info(`[TriggerAuditManager - runAnalysis] AuditRun completed: ${auditRunId}`);
    } catch (asyncError) {
        AppLogger.error(`[TriggerAuditManager - runAnalysis] Async audit error: ${asyncError}`);
        await AuditRunProvider.updateAuditRunStatus({
            auditRunId,
            runStatus: 'error',
            errorMessage: String(asyncError),
        }).catch((err) =>
            AppLogger.warn(
                `[TriggerAuditManager - runAnalysis] Failed to update error status: ${err}`,
            ),
        );
    }
};

/**
 * Creates an AuditRun, marks it in progress and kicks off the analysis jobs.
 * Returns a discriminated result so the controller can map it to an HTTP code
 * without leaking framework concerns into the business logic.
 */
const triggerAudit = async ({
    applicationId,
    branch,
    analysisTypes,
}: TriggerAuditParams): Promise<TriggerAuditResult> => {
    try {
        const numericApplicationId = Number(applicationId);

        AppLogger.info(
            `[TriggerAuditManager - triggerAudit] applicationId: ${applicationId}, branch: ${branch}, analysisTypes: ${analysisTypes?.join(',')}`,
        );

        if (!Number.isInteger(numericApplicationId)) {
            return { status: 'invalid-application' };
        }

        const application = await ApplicationProvider.getApplicationDetailsInfoByParams({
            _id: numericApplicationId,
        });

        if (!application?._id) {
            return { status: 'application-not-found' };
        }

        const auditRun = await AuditRunProvider.createAuditRun({
            appId: numericApplicationId,
            branch: branch || undefined,
            runStatus: 'pending',
            analysisTypes: analysisTypes || ['static', 'dynamic', 'devops'],
        });

        if (!auditRun?._id) {
            return { status: 'creation-failed' };
        }

        const auditRunId = Number(auditRun._id);

        if (!Number.isInteger(auditRunId)) {
            return { status: 'invalid-run-id' };
        }

        const applicationForAnalysis = application as unknown as ApplicationForAnalysis;

        await AuditRunProvider.updateAuditRunStatus({
            auditRunId,
            runStatus: 'in_progress',
        });

        void runAnalysis({
            application: applicationForAnalysis,
            branch,
            analysisTypes,
            auditRunId,
        });

        return { status: 'triggered', auditRun };
    } catch (error) {
        AppLogger.error(`[TriggerAuditManager - triggerAudit] error: ${error}`);
        return { status: 'error' };
    }
};

const TriggerAuditManager = {
    triggerAudit,
};

export default TriggerAuditManager;

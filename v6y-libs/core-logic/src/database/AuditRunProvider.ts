import AppLogger from '../core/AppLogger.ts';
import { AuditRunType } from '../types/AuditRunType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createAuditRun = async (auditRun: AuditRunType) => {
    try {
        AppLogger.info(
            '[AuditRunProvider - createAuditRun] appId: ' +
                auditRun?.appId +
                ' analysisTypes: ' +
                auditRun?.analysisTypes?.join(','),
        );

        if (!auditRun?.appId) {
            AppLogger.error('[AuditRunProvider - createAuditRun] Missing appId');
            return null;
        }

        // Check if there's a recent pending run for the same app/branch (within last 5 minutes)
        // to avoid creating duplicates
        const recentRun = await getPrismaClient().auditRun.findFirst({
            where: {
                appId: auditRun.appId,
                branch: auditRun.branch ?? null,
                runStatus: 'pending',
                triggeredAt: {
                    gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
                },
            },
            orderBy: { triggeredAt: 'desc' },
        });

        if (recentRun) {
            AppLogger.info(
                '[AuditRunProvider - createAuditRun] Reusing recent run: ' + recentRun.id,
            );
            return { ...recentRun, _id: recentRun.id };
        }

        const created = await getPrismaClient().auditRun.create({
            data: {
                appId: auditRun.appId,
                branch: auditRun.branch ?? null,
                runStatus: auditRun.runStatus ?? 'pending',
                analysisTypes: auditRun.analysisTypes ?? [],
                errorMessage: auditRun.errorMessage ?? null,
            },
        });

        AppLogger.info('[AuditRunProvider - createAuditRun] created: ' + created.id);
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.error('[AuditRunProvider - createAuditRun] error: ', error);
        return null;
    }
};

const updateAuditRunStatus = async ({
    auditRunId,
    runStatus,
    completedAt,
    errorMessage,
}: {
    auditRunId: number;
    runStatus: string;
    completedAt?: Date;
    errorMessage?: string;
}) => {
    try {
        AppLogger.info(
            '[AuditRunProvider - updateAuditRunStatus] auditRunId: ' +
                auditRunId +
                ' status: ' +
                runStatus,
        );

        const updated = await getPrismaClient().auditRun.update({
            where: { id: auditRunId },
            data: {
                runStatus,
                completedAt: completedAt ?? null,
                errorMessage: errorMessage ?? null,
            },
        });

        AppLogger.info('[AuditRunProvider - updateAuditRunStatus] updated: ' + updated.id);
        return { ...updated, _id: updated.id };
    } catch (error) {
        AppLogger.error('[AuditRunProvider - updateAuditRunStatus] error: ', error);
        return null;
    }
};

/**
 * Complete an audit run after all audits are done
 */
const completeAuditRun = async (auditRunId: number, hasErrors: boolean = false) => {
    try {
        AppLogger.info(
            '[AuditRunProvider - completeAuditRun] auditRunId: ' +
                auditRunId +
                ' hasErrors: ' +
                hasErrors,
        );

        const completed = await updateAuditRunStatus({
            auditRunId,
            runStatus: hasErrors ? 'failed' : 'completed',
            completedAt: new Date(),
            errorMessage: hasErrors ? 'Audit completed with errors' : undefined,
        });

        AppLogger.info('[AuditRunProvider - completeAuditRun] completed: ' + auditRunId);
        return completed;
    } catch (error) {
        AppLogger.error('[AuditRunProvider - completeAuditRun] error: ', error);
        return null;
    }
};

/**
 * Get audit run with all its audits to check completion
 */
const getAuditRunWithAudits = async (auditRunId: number) => {
    try {
        const auditRun = await getPrismaClient().auditRun.findUnique({
            where: { id: auditRunId },
            include: { audits: true },
        });

        return auditRun ? { ...auditRun, _id: auditRun.id } : null;
    } catch (error) {
        AppLogger.error('[AuditRunProvider - getAuditRunWithAudits] error: ', error);
        return null;
    }
};

const getAuditRunById = async (auditRunId: number) => {
    try {
        const auditRun = await getPrismaClient().auditRun.findUnique({
            where: { id: auditRunId },
            include: { audits: true },
        });

        AppLogger.info('[AuditRunProvider - getAuditRunById] found: ' + auditRunId);
        return auditRun ? { ...auditRun, _id: auditRun.id } : null;
    } catch (error) {
        AppLogger.error('[AuditRunProvider - getAuditRunById] error: ', error);
        return null;
    }
};

const getAuditRunsByApplicationId = async (appId: number, limit?: number, offset?: number) => {
    try {
        AppLogger.info('[AuditRunProvider - getAuditRunsByApplicationId] appId: ' + appId);

        const skip = offset ?? 0;
        const take = limit ?? 20;

        const auditRuns = await getPrismaClient().auditRun.findMany({
            where: { appId },
            orderBy: { triggeredAt: 'desc' },
            skip,
            take,
            include: { audits: true },
        });

        AppLogger.info(
            '[AuditRunProvider - getAuditRunsByApplicationId] count: ' + auditRuns?.length,
        );

        const mapped = auditRuns.map((run) => ({
            ...run,
            _id: run.id,
            audits: run.audits.map((audit) => ({
                ...audit,
                _id: audit.id,
            })),
        }));

        AppLogger.info(
            '[AuditRunProvider - getAuditRunsByApplicationId] mapped first: ' +
                JSON.stringify(mapped[0]),
        );

        return mapped;
    } catch (error) {
        AppLogger.error('[AuditRunProvider - getAuditRunsByApplicationId] error: ', error);
        return [];
    }
};

const getLatestAuditRun = async (appId: number) => {
    try {
        AppLogger.info('[AuditRunProvider - getLatestAuditRun] appId: ' + appId);

        const auditRun = await getPrismaClient().auditRun.findFirst({
            where: { appId },
            orderBy: { triggeredAt: 'desc' },
            include: { audits: true },
        });

        AppLogger.info('[AuditRunProvider - getLatestAuditRun] found: ' + auditRun?.id);
        return auditRun ? { ...auditRun, _id: auditRun.id } : null;
    } catch (error) {
        AppLogger.error('[AuditRunProvider - getLatestAuditRun] error: ', error);
        return null;
    }
};

const getAuditRunsCountByApplicationId = async (appId: number) => {
    try {
        const count = await getPrismaClient().auditRun.count({
            where: { appId },
        });

        AppLogger.info('[AuditRunProvider - getAuditRunsCountByApplicationId] count: ' + count);
        return count;
    } catch (error) {
        AppLogger.error('[AuditRunProvider - getAuditRunsCountByApplicationId] error: ', error);
        return 0;
    }
};

const deleteAuditRun = async (auditRunId: number) => {
    try {
        AppLogger.info('[AuditRunProvider - deleteAuditRun] auditRunId: ' + auditRunId);

        await getPrismaClient().auditRun.delete({
            where: { id: auditRunId },
        });

        AppLogger.info('[AuditRunProvider - deleteAuditRun] deleted: ' + auditRunId);
        return { _id: auditRunId };
    } catch (error) {
        AppLogger.error('[AuditRunProvider - deleteAuditRun] error: ', error);
        return null;
    }
};

const getAllAuditRuns = async (limit?: number, offset?: number) => {
    try {
        AppLogger.info(
            '[AuditRunProvider - getAllAuditRuns] limit: ' + limit + ', offset: ' + offset,
        );

        const auditRuns = await getPrismaClient().auditRun.findMany({
            take: limit,
            skip: offset,
            orderBy: { triggeredAt: 'desc' },
            include: { audits: true },
        });

        AppLogger.info('[AuditRunProvider - getAllAuditRuns] count: ' + auditRuns?.length);

        const mapped = auditRuns.map((run) => ({ ...run, _id: run.id }));

        AppLogger.info('[AuditRunProvider - getAllAuditRuns] mapped first: ' + mapped[0]?.appId);
        return mapped || [];
    } catch (error) {
        AppLogger.error('[AuditRunProvider - getAllAuditRuns] error: ', error);
        return [];
    }
};

const AuditRunProvider = {
    createAuditRun,
    updateAuditRunStatus,
    completeAuditRun,
    getAuditRunWithAudits,
    getAuditRunById,
    getAuditRunsByApplicationId,
    getAuditRunsByAppId: getAuditRunsByApplicationId,
    getLatestAuditRun,
    getAuditRunsCountByApplicationId,
    deleteAuditRun,
    getAllAuditRuns,
};

export default AuditRunProvider;

import AppLogger from '../core/AppLogger.ts';
import { AuditRunType } from '../types/AuditRunType.ts';
import { AuditModelType } from './models/AuditModel.ts';
import { AuditRunModelType } from './models/AuditRunModel.ts';

/**
 * Creates a new AuditRun session for an application.
 */
const createAuditRun = async ({
    appId,
    triggeredBy,
}: {
    appId: number;
    triggeredBy?: string;
}): Promise<AuditRunType | null> => {
    try {
        AppLogger.info(`[AuditRunProvider - createAuditRun] appId: ${appId}`);

        if (!appId) return null;

        const run = await AuditRunModelType.create({
            appId,
            triggeredAt: new Date(),
            status: 'RUNNING',
            triggeredBy,
        });

        AppLogger.info(`[AuditRunProvider - createAuditRun] created run _id: ${run?._id}`);

        return run?.dataValues ?? null;
    } catch (error) {
        AppLogger.info(`[AuditRunProvider - createAuditRun] error: ${error}`);
        return null;
    }
};

/**
 * Marks an AuditRun as completed (COMPLETED or FAILED).
 */
const completeAuditRun = async ({
    _id,
    status,
}: {
    _id: number;
    status: 'COMPLETED' | 'FAILED';
}): Promise<{ _id: number } | null> => {
    try {
        AppLogger.info(`[AuditRunProvider - completeAuditRun] _id: ${_id}, status: ${status}`);

        if (!_id) return null;

        await AuditRunModelType.update({ completedAt: new Date(), status }, { where: { _id } });

        return { _id };
    } catch (error) {
        AppLogger.info(`[AuditRunProvider - completeAuditRun] error: ${error}`);
        return null;
    }
};

/**
 * Returns all AuditRun sessions for an application, ordered by most recent first.
 */
const getAuditRunsByAppId = async ({ appId }: { appId: number }): Promise<AuditRunType[]> => {
    try {
        AppLogger.info(`[AuditRunProvider - getAuditRunsByAppId] appId: ${appId}`);

        const runs = await AuditRunModelType.findAll({
            where: { appId },
            order: [['triggered_at', 'DESC']],
        });

        return runs.map((r) => r.dataValues);
    } catch (error) {
        AppLogger.info(`[AuditRunProvider - getAuditRunsByAppId] error: ${error}`);
        return [];
    }
};

/**
 * Returns a single AuditRun with its associated AuditReport records.
 */
const getAuditRunById = async ({ _id }: { _id: number }): Promise<AuditRunType | null> => {
    try {
        AppLogger.info(`[AuditRunProvider - getAuditRunById] _id: ${_id}`);

        if (!_id) return null;

        const run = await AuditRunModelType.findOne({
            where: { _id },
            include: [{ model: AuditModelType, as: 'auditReports' }],
        });

        if (!run) return null;

        return {
            ...run.dataValues,
        };
    } catch (error) {
        AppLogger.info(`[AuditRunProvider - getAuditRunById] error: ${error}`);
        return null;
    }
};

/**
 * Deletes all AuditRun sessions (and their audit reports via CASCADE) for an application.
 */
const deleteAuditRunsByAppId = async ({ appId }: { appId: number }): Promise<boolean> => {
    try {
        await AuditRunModelType.destroy({ where: { appId } });
        return true;
    } catch (error) {
        AppLogger.info(`[AuditRunProvider - deleteAuditRunsByAppId] error: ${error}`);
        return false;
    }
};

const AuditRunProvider = {
    createAuditRun,
    completeAuditRun,
    getAuditRunsByAppId,
    getAuditRunById,
    deleteAuditRunsByAppId,
};

export default AuditRunProvider;

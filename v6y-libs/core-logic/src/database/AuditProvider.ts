import { Prisma } from '@prisma/client';

import AppLogger from '../core/AppLogger.ts';
import { AuditType } from '../types/AuditType.ts';
import AuditHelpProvider from './AuditHelpProvider.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createAudit = async (audit: AuditType) => {
    try {
        AppLogger.info(
            '[AuditProvider - createAudit] type: ' + audit?.type + ' category: ' + audit?.category,
        );
        if (!audit?.type?.length || !audit?.category?.length) return null;

        const auditHelp = await AuditHelpProvider.getAuditHelpDetailsByParams({
            category: audit.type + '-' + audit.category,
        });

        const created = await getPrismaClient().audit.create({
            data: {
                appId: (audit.module?.appId ?? audit.appId)!,
                auditRunId: audit.auditRunId ?? null,
                dateStart: audit.dateStart ?? null,
                dateEnd: audit.dateEnd ?? null,
                type: audit.type ?? null,
                category: audit.category ?? null,
                subCategory: audit.subCategory ?? null,
                auditStatus: audit.auditStatus ?? null,
                score: audit.score ?? null,
                scoreStatus: audit.scoreStatus ?? null,
                scoreUnit: audit.scoreUnit ?? null,
                extraInfos: audit.extraInfos ?? null,
                auditHelp: auditHelp ? (auditHelp as unknown as Prisma.InputJsonValue) : undefined,
                module: audit.module
                    ? (audit.module as unknown as Prisma.InputJsonValue)
                    : undefined,
            },
        });
        AppLogger.info('[AuditProvider - createAudit] created: ' + created.id);
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.error('[AuditProvider - createAudit] error: ', error);
        return null;
    }
};

const insertAuditList = async (auditList: AuditType[] | null) => {
    try {
        if (!auditList?.length) return false;

        const records = (await Promise.all(
            auditList
                .filter((audit) => audit?.type?.length && audit?.category?.length)
                .map(async (audit) => {
                    const auditHelp = await AuditHelpProvider.getAuditHelpDetailsByParams({
                        category: audit.type + '-' + audit.category,
                    });
                    return {
                        appId: (audit.module?.appId ?? audit.appId)!,
                        auditRunId: audit.auditRunId ?? null,
                        dateStart: audit.dateStart ?? null,
                        dateEnd: audit.dateEnd ?? null,
                        type: audit.type ?? null,
                        category: audit.category ?? null,
                        subCategory: audit.subCategory ?? null,
                        auditStatus: audit.auditStatus ?? null,
                        score: audit.score ?? null,
                        scoreStatus: audit.scoreStatus ?? null,
                        scoreUnit: audit.scoreUnit ?? null,
                        extraInfos: audit.extraInfos ?? null,
                        auditHelp: auditHelp
                            ? (auditHelp as unknown as Prisma.InputJsonValue)
                            : undefined,
                        module: audit.module
                            ? (audit.module as unknown as Prisma.InputJsonValue)
                            : undefined,
                    };
                }),
        )) as Prisma.AuditCreateManyInput[];

        if (!records.length) return false;
        await getPrismaClient().audit.createMany({ data: records, skipDuplicates: true });
        return true;
    } catch (error) {
        AppLogger.error('[AuditProvider - insertAuditList] error: ', error);
        return false;
    }
};

const editAudit = async (audit: AuditType) => {
    try {
        if (!audit?._id || !audit?.type?.length || !audit?.category?.length) return null;
        await getPrismaClient().audit.update({
            where: { id: audit._id },
            data: {
                type: audit.type ?? null,
                category: audit.category ?? null,
                subCategory: audit.subCategory ?? null,
                auditStatus: audit.auditStatus ?? null,
                score: audit.score ?? null,
                scoreStatus: audit.scoreStatus ?? null,
                scoreUnit: audit.scoreUnit ?? null,
                extraInfos: audit.extraInfos ?? null,
            },
        });
        return { _id: audit._id };
    } catch (error) {
        AppLogger.error('[AuditProvider - editAudit] error: ', error);
        return null;
    }
};

const deleteAudit = async ({ _id }: AuditType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().audit.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.error('[AuditProvider - deleteAudit] error: ', error);
        return null;
    }
};

/**
 * Deletes all Audit entries for a given application.
 * @param appId
 */
const deleteAuditsByAppId = async (appId: number) => {
    try {
        AppLogger.info(`[AuditProvider - deleteAuditsByAppId] appId:  ${appId}`);
        await getPrismaClient().audit.deleteMany({
            where: { appId },
        });
        return true;
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAuditsByAppId] error:  ${error}`);
        return false;
    }
};

const deleteAuditList = async () => {
    try {
        await getPrismaClient().audit.deleteMany();
        return true;
    } catch (error) {
        AppLogger.error('[AuditProvider - deleteAuditList] error: ', error);
        return false;
    }
};

const getAuditListByPageAndParams = async ({ appId }: AuditType) => {
    try {
        const list = await getPrismaClient().audit.findMany({
            where: appId ? { appId } : undefined,
        });
        AppLogger.info('[AuditProvider - getAuditListByPageAndParams] count: ' + list?.length);
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.error('[AuditProvider - getAuditListByPageAndParams] error: ', error);
        return [];
    }
};

const AuditProvider = {
    createAudit,
    insertAuditList,
    editAudit,
    deleteAudit,
    deleteAuditsByAppId,
    deleteAuditList,
    getAuditListByPageAndParams,
};
export default AuditProvider;

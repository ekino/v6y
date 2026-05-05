import { defaultAuditHelpStatus } from '../config/AuditHelpConfig.ts';
import AppLogger from '../core/AppLogger.ts';
import { AuditHelpType } from '../types/AuditHelpType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const createAuditHelp = async (auditHelp: AuditHelpType): Promise<AuditHelpType | null> => {
    try {
        AppLogger.info('[AuditHelpProvider - createAuditHelp] title: ' + auditHelp?.title);
        if (!auditHelp?.title?.length) return null;
        const created = await getPrismaClient().auditHelp.create({
            data: {
                category: auditHelp.category!,
                title: auditHelp.title!,
                description: auditHelp.description!,
                explanation: auditHelp.explanation ?? null,
            },
        });
        return {
            ...created,
            _id: created.id,
            explanation: created.explanation ?? undefined,
        } as AuditHelpType;
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - createAuditHelp] error: ' + error);
        return null;
    }
};

const editAuditHelp = async (auditHelp: AuditHelpType) => {
    try {
        if (!auditHelp?._id || !auditHelp?.title?.length) return null;
        await getPrismaClient().auditHelp.update({
            where: { id: auditHelp._id },
            data: {
                category: auditHelp.category!,
                title: auditHelp.title!,
                description: auditHelp.description!,
                explanation: auditHelp.explanation ?? null,
            },
        });
        return { _id: auditHelp._id };
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - editAuditHelp] error: ' + error);
        return null;
    }
};

const deleteAuditHelp = async ({ _id }: AuditHelpType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().auditHelp.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - deleteAuditHelp] error: ' + error);
        return null;
    }
};

const deleteAuditHelpList = async () => {
    try {
        await getPrismaClient().auditHelp.deleteMany();
        return true;
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - deleteAuditHelpList] error: ' + error);
        return false;
    }
};

const getAuditHelpListByPageAndParams = async ({ start, limit }: SearchQueryType) => {
    try {
        const list = await getPrismaClient().auditHelp.findMany({
            skip: start ?? undefined,
            take: limit ?? undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - getAuditHelpListByPageAndParams] error: ' + error);
        return [];
    }
};

const getAuditHelpDetailsByParams = async ({ _id, category }: AuditHelpType) => {
    try {
        const item = await getPrismaClient().auditHelp.findFirst({
            where: _id ? { id: _id } : { category },
        });
        if (!item) return null;
        return {
            ...item,
            _id: item.id,
            explanation: item.explanation ?? undefined,
        } as AuditHelpType;
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - getAuditHelpDetailsByParams] error: ' + error);
        return null;
    }
};

const initDefaultData = async () => {
    try {
        const count = await getPrismaClient().auditHelp.count();
        if (count > 0) return true;
        for (const auditHelp of defaultAuditHelpStatus) {
            await createAuditHelp(auditHelp);
        }
        return true;
    } catch (error) {
        AppLogger.info('[AuditHelpProvider - initDefaultData] error: ' + error);
        return false;
    }
};

const AuditHelpProvider = {
    initDefaultData,
    createAuditHelp,
    editAuditHelp,
    deleteAuditHelp,
    deleteAuditHelpList,
    getAuditHelpListByPageAndParams,
    getAuditHelpDetailsByParams,
};
export default AuditHelpProvider;

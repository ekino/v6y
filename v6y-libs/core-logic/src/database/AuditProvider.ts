import { FindOptions } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { AuditType } from '../types/AuditType.ts';
import AuditHelpProvider from './AuditHelpProvider.ts';
import ModuleProvider from './ModuleProvider.ts';
import { AuditHelpModelType } from './models/AuditHelpModel.ts';
import { AuditModelType } from './models/AuditModel.ts';
import { ModuleModelType } from './models/ModuleModel.ts';

/**
 * Shapes a raw Sequelize audit instance into the expected output format,
 * surfacing the associated `module` and `auditHelp` as top-level keys for
 * backward compatibility with the GraphQL layer.
 */
const shapeAudit = (item: AuditModelType) => ({
    ...item.dataValues,
    module: (item as unknown as Record<string, { dataValues: unknown }>).module?.dataValues ?? null,
    auditHelp:
        (item as unknown as Record<string, { dataValues: unknown }>).auditHelp?.dataValues ?? null,
});

/**
 * Creates a new Audit entry in the database.
 * @param audit
 */
const createAudit = async (audit: AuditType) => {
    try {
        AppLogger.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);

        if (!audit?.type?.length || !audit?.category?.length) {
            return null;
        }

        // Resolve module FK
        const moduleRecord = audit.module
            ? await ModuleProvider.findOrCreateModule(audit.module)
            : null;

        // Resolve auditHelp FK
        const auditHelp = await AuditHelpProvider.getAuditHelpDetailsByParams({
            category: `${audit.type}-${audit.category}`,
        });

        const { module: _module, auditHelp: _auditHelp, ...auditFields } = audit;

        const createdAudit = await AuditModelType.create({
            ...auditFields,
            appId: audit.module?.appId ?? audit.appId,
            moduleId: moduleRecord?._id ?? undefined,
            auditHelpId: auditHelp?._id ?? undefined,
        });

        AppLogger.info(`[AuditProvider - createAudit] createdAudit: ${createdAudit?._id}`);

        return createdAudit;
    } catch (error) {
        AppLogger.info(`[AuditProvider - createAudit] error:  ${error}`);
        return null;
    }
};

/**
 * Inserts a list of Audit entries in the database.
 * @param auditList
 */
const insertAuditList = async (auditList: AuditType[] | null) => {
    try {
        AppLogger.info(`[AuditProvider - insertAuditList] auditList:  ${auditList?.length}`);
        if (!auditList?.length) {
            return false;
        }

        for (const audit of auditList) {
            await createAudit(audit);
        }

        AppLogger.info(`[AuditProvider - insertAuditList] audit reports inserted successfully`);

        return true;
    } catch (error) {
        AppLogger.info(`[AuditProvider - insertAuditList] error:  ${error}`);
        return false;
    }
};

/**
 * Edits an existing Audit entry in the database.
 * @param audit
 */
const editAudit = async (audit: AuditType) => {
    try {
        AppLogger.info(`[AuditProvider - editAudit] audit type:  ${audit?.type}`);
        AppLogger.info(`[AuditProvider - editAudit] audit category:  ${audit?.category}`);
        AppLogger.info(`[AuditProvider - editAudit] audit subCategory:  ${audit?.subCategory}`);

        if (!audit?._id || !audit?.type?.length || !audit?.category?.length) {
            return null;
        }

        const { module: _module, auditHelp: _auditHelp, ...auditFields } = audit;

        const editedAudit = await AuditModelType.update(auditFields, {
            where: { _id: audit._id },
        });

        AppLogger.info(`[AuditProvider - editAudit] editedAudit: ${editedAudit?.[0]}`);

        return { _id: audit._id };
    } catch (error) {
        AppLogger.info(`[AuditProvider - editAudit] error:  ${error}`);
        return null;
    }
};

/**
 * Deletes an Audit entry from the database.
 * @param _id
 */
const deleteAudit = async ({ _id }: AuditType) => {
    try {
        AppLogger.info(`[AuditProvider - deleteAudit] _id:  ${_id}`);
        if (!_id) {
            return null;
        }

        await AuditModelType.destroy({ where: { _id } });

        return { _id };
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAudit] error:  ${error}`);
        return null;
    }
};

/**
 * Deletes all Audit entries for an application.
 * @param appId
 */
const deleteAuditListByAppId = async ({ appId }: { appId: number }) => {
    try {
        await AuditModelType.destroy({ where: { appId } });
        return true;
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAuditListByAppId] error:  ${error}`);
        return false;
    }
};

/**
 * Fetches a list of Audit entries from the database, with module and auditHelp joined.
 * Optionally filters by appId and/or auditRunId for history queries.
 */
const getAuditListByPageAndParams = async ({
    appId,
    auditRunId,
}: {
    appId?: number;
    auditRunId?: number;
}) => {
    try {
        AppLogger.info(
            `[AuditProvider - getAuditListByPageAndParams] appId: ${appId}, auditRunId: ${auditRunId}`,
        );

        const queryOptions: FindOptions = {
            include: [
                { model: ModuleModelType, as: 'module', required: false },
                { model: AuditHelpModelType, as: 'auditHelp', required: false },
            ],
            order: [['date_start', 'DESC']],
        };

        const where: Record<string, unknown> = {};
        if (appId) where.appId = appId;
        if (auditRunId) where.auditRunId = auditRunId;
        if (Object.keys(where).length) queryOptions.where = where;

        const auditList = await AuditModelType.findAll(queryOptions);
        AppLogger.info(
            `[AuditProvider - getAuditListByPageAndParams] auditList: ${auditList?.length}`,
        );

        return auditList?.map(shapeAudit) || [];
    } catch (error) {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] error:  ${error}`);
        return [];
    }
};

const deleteAuditList = async () => {
    try {
        await AuditModelType.destroy({ truncate: true });
        return true;
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAuditList] error:  ${error}`);
        return false;
    }
};

const AuditProvider = {
    createAudit,
    insertAuditList,
    editAudit,
    deleteAudit,
    deleteAuditList,
    deleteAuditListByAppId,
    getAuditListByPageAndParams,
};

export default AuditProvider;

import AppLogger from '../core/AppLogger.ts';
import AuditHelpProvider from './AuditHelpProvider.ts';
import { AuditModelType } from './models/AuditModel.ts';
/**
 * Creates a new Audit entry in the database.
 * @param audit
 */
const createAudit = async (audit) => {
    try {
        AppLogger.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);
        if (!audit?.type?.length || !audit?.category?.length) {
            return null;
        }
        const auditHelp = await AuditHelpProvider.getAuditHelpDetailsByParams({
            category: `${audit.type}-${audit.category}`,
        });
        const createdAudit = await AuditModelType.create({
            ...audit,
            appId: audit.module?.appId,
            auditHelp,
        });
        AppLogger.info(`[AuditProvider - createAudit] createdAudit: ${createdAudit?._id}`);
        return createdAudit;
    }
    catch (error) {
        AppLogger.info(`[AuditProvider - createAudit] error:  ${error}`);
        return null;
    }
};
/**
 * Inserts a list of Audit entries in the database.
 * @param auditList
 */
const insertAuditList = async (auditList) => {
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
    }
    catch (error) {
        AppLogger.info(`[AuditProvider - insertAuditList] error:  ${error}`);
        return false;
    }
};
/**
 * Edits an existing Audit entry in the database.
 * @param audit
 */
const editAudit = async (audit) => {
    try {
        AppLogger.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);
        if (!audit?._id || !audit?.type?.length || !audit?.category?.length) {
            return null;
        }
        const editedAudit = await AuditModelType.update(audit, {
            where: {
                _id: audit?._id,
            },
        });
        AppLogger.info(`[AuditProvider - editAudit] editedAudit: ${editedAudit?.[0]}`);
        return {
            _id: audit?._id,
        };
    }
    catch (error) {
        AppLogger.info(`[AuditProvider - editAudit] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes an Audit entry from the database.
 * @param _id
 */
const deleteAudit = async ({ _id }) => {
    try {
        AppLogger.info(`[AuditProvider - deleteAudit] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await AuditModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger.info(`[AuditProvider - deleteAudit] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes all Audit entries from the database.
 */
const deleteAuditList = async () => {
    try {
        await AuditModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger.info(`[AuditProvider - deleteAuditList] error:  ${error}`);
        return false;
    }
};
/**
 * Fetches a list of Audit entries from the database based on the provided parameters.
 * @param appId
 */
const getAuditListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const auditList = await AuditModelType.findAll(queryOptions);
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] auditList: ${auditList?.length}`);
        return auditList;
    }
    catch (error) {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] error:  ${error}`);
        return [];
    }
};
const AuditProvider = {
    createAudit,
    insertAuditList,
    editAudit,
    deleteAudit,
    deleteAuditList,
    getAuditListByPageAndParams,
};
export default AuditProvider;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const AuditHelpProvider_1 = __importDefault(require("./AuditHelpProvider"));
const AuditModel_1 = require("./models/AuditModel");
/**
 * Creates a new Audit entry in the database.
 * @param audit
 */
const createAudit = async (audit) => {
    try {
        AppLogger_1.default.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger_1.default.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger_1.default.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);
        if (!audit?.type?.length || !audit?.category?.length) {
            return null;
        }
        const auditHelp = await AuditHelpProvider_1.default.getAuditHelpDetailsByParams({
            category: `${audit.type}-${audit.category}`,
        });
        const createdAudit = await AuditModel_1.AuditModelType.create({
            ...audit,
            appId: audit.module?.appId,
            auditHelp,
        });
        AppLogger_1.default.info(`[AuditProvider - createAudit] createdAudit: ${createdAudit?._id}`);
        return createdAudit;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditProvider - createAudit] error:  ${error}`);
        return null;
    }
};
/**
 * Inserts a list of Audit entries in the database.
 * @param auditList
 */
const insertAuditList = async (auditList) => {
    try {
        AppLogger_1.default.info(`[AuditProvider - insertAuditList] auditList:  ${auditList?.length}`);
        if (!auditList?.length) {
            return false;
        }
        for (const audit of auditList) {
            await createAudit(audit);
        }
        AppLogger_1.default.info(`[AuditProvider - insertAuditList] audit reports inserted successfully`);
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditProvider - insertAuditList] error:  ${error}`);
        return false;
    }
};
/**
 * Edits an existing Audit entry in the database.
 * @param audit
 */
const editAudit = async (audit) => {
    try {
        AppLogger_1.default.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger_1.default.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger_1.default.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);
        if (!audit?._id || !audit?.type?.length || !audit?.category?.length) {
            return null;
        }
        const editedAudit = await AuditModel_1.AuditModelType.update(audit, {
            where: {
                _id: audit?._id,
            },
        });
        AppLogger_1.default.info(`[AuditProvider - editAudit] editedAudit: ${editedAudit?.[0]}`);
        return {
            _id: audit?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditProvider - editAudit] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes an Audit entry from the database.
 * @param _id
 */
const deleteAudit = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[AuditProvider - deleteAudit] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await AuditModel_1.AuditModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditProvider - deleteAudit] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes all Audit entries from the database.
 */
const deleteAuditList = async () => {
    try {
        await AuditModel_1.AuditModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditProvider - deleteAuditList] error:  ${error}`);
        return false;
    }
};
/**
 * Fetches a list of Audit entries from the database based on the provided parameters.
 * @param appId
 */
const getAuditListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger_1.default.info(`[AuditProvider - getAuditListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const auditList = await AuditModel_1.AuditModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[AuditProvider - getAuditListByPageAndParams] auditList: ${auditList?.length}`);
        return auditList;
    }
    catch (error) {
        AppLogger_1.default.info(`[AuditProvider - getAuditListByPageAndParams] error:  ${error}`);
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
exports.default = AuditProvider;

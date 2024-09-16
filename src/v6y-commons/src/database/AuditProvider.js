import AppLogger from '../core/AppLogger.js';
import AuditHelpProvider from './AuditHelpProvider.js';
import DataBaseManager from './DataBaseManager.js';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.js';
import AuditModel from './models/AuditModel.js';

/**
 * Creates a new Audit entry in the database.
 *
 * @param {Object} audit - The Audit data to be created.
 * @returns {Object|null} The created Audit object or null on error or if the Audit model is not found.
 */
const createAudit = async (audit) => {
    try {
        AppLogger.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);

        if (!audit?.type?.length || !audit?.category?.length) {
            return null;
        }

        const auditModel = DataBaseManager.getDataBaseSchema(AuditModel.name);

        if (!auditModel) {
            return null;
        }

        const createdAudit = await auditModel.create(audit);
        AppLogger.info(`[AuditProvider - createAudit] createdAudit: ${createdAudit?._id}`);

        return createdAudit;
    } catch (error) {
        AppLogger.info(`[AuditProvider - createAudit] error:  ${error.message}`);
        return null;
    }
};

/**
 * Bulk insert of audit list
 * @param {Array} auditList
 * @returns {Promise<null>}
 */
const insertAuditList = async (auditList) => {
    try {
        AppLogger.info(`[AuditProvider - insertAuditList] auditList:  ${auditList?.length}`);
        if (!auditList?.length) {
            return null;
        }

        const auditModel = DataBaseManager.getDataBaseSchema(AuditModel.name);

        if (!auditModel) {
            return null;
        }

        for (const audit of auditList) {
            await createAudit(audit);
        }

        AppLogger.info(`[AuditProvider - insertAuditList] audit reports inserted successfully`);
    } catch (error) {
        AppLogger.info(`[AuditProvider - insertAuditList] error:  ${error.message}`);
    }
};

/**
 * Edits an existing Audit entry in the database.
 *
 * @param {Object} audit - The Audit data with updated information.
 * @returns {Object|null} An object containing the ID of the edited Audit or null on error or if the Audit model is not found.
 */
const editAudit = async (audit) => {
    try {
        AppLogger.info(`[AuditProvider - createAudit] audit type:  ${audit?.type}`);
        AppLogger.info(`[AuditProvider - createAudit] audit category:  ${audit?.category}`);
        AppLogger.info(`[AuditProvider - createAudit] audit subCategory:  ${audit?.subCategory}`);

        if (!audit?._id || !audit?.type?.length || !audit?.category?.length) {
            return null;
        }

        const auditModel = DataBaseManager.getDataBaseSchema(AuditModel.name);

        if (!auditModel) {
            return null;
        }

        const editedAudit = await auditModel.update(audit, {
            where: {
                _id: audit?._id,
            },
        });

        AppLogger.info(`[AuditProvider - editAudit] editedAudit: ${editedAudit?._id}`);

        return {
            _id: audit?._id,
        };
    } catch (error) {
        AppLogger.info(`[AuditProvider - editAudit] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes an Audit from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.auditId - The ID of the Audit to delete.
 * @returns {Object|null} An object containing the ID of the deleted Audit, or null on error or if auditId is not provided or if the Audit model is not found.
 */
const deleteAudit = async ({ auditId }) => {
    try {
        AppLogger.info(`[AuditProvider - deleteAudit] auditId:  ${auditId}`);
        if (!auditId) {
            return null;
        }

        const auditModel = DataBaseManager.getDataBaseSchema(AuditModel.name);

        if (!auditModel) {
            return null;
        }

        await auditModel.destroy({
            where: {
                _id: auditId,
            },
        });

        return {
            _id: auditId,
        };
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAudit] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all Audits from the database
 *
 * @returns {Promise<boolean|null>} True if the deletion was successful, false otherwise
 */
const deleteAuditList = async () => {
    try {
        const auditModel = DataBaseManager.getDataBaseSchema(AuditModel.name);
        if (!auditModel) {
            return null;
        }

        await auditModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[AuditProvider - deleteAuditList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves a list of audits based on the provided appId.
 *
 * @param {Object} params - Parameters object containing the appId.
 * @param {string} params.appId - The ID of the application to retrieve audits for.
 * @param {boolean} params.fullReport - If reports should be full or not.
 * @returns {Promise<Array>} A Promise resolving to an array of audits, or an empty array in case of an error.
 */
const getAuditListByPageAndParams = async ({ appId, fullReport = true }) => {
    try {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] appId: ${appId}`);

        const auditModel = DataBaseManager.getDataBaseSchema(AuditModel.name);
        if (!auditModel) {
            return null;
        }

        const auditList = await auditModel.findAll();
        AppLogger.info(
            `[AuditProvider - getAuditListByPageAndParams] auditList: ${auditList?.length}`,
        );

        if (!auditList?.length) {
            return null;
        }

        const fullAuditReports = [];

        for (const audit of auditList) {
            if (appId && audit.module?.appId !== Number.parseInt(appId, 10)) {
                continue;
            }

            if (fullReport) {
                const auditHelp = await AuditHelpProvider.getAuditHelpDetailsByParams({
                    category: [`${audit.type}-${audit.category}`],
                });

                fullAuditReports.push({
                    ...audit,
                    auditHelp,
                });

                continue;
            }

            fullAuditReports.push(audit);
        }

        return fullAuditReports;
    } catch (error) {
        AppLogger.info(`[AuditProvider - getAuditListByPageAndParams] error:  ${error.message}`);
        return [];
    }
};

/**
 * An object that provides various operations related to Audits.
 */
const AuditProvider = {
    createAudit,
    insertAuditList,
    editAudit,
    deleteAudit,
    deleteAuditList,
    getAuditListByPageAndParams,
};

export default AuditProvider;

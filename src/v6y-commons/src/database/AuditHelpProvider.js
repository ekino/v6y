import { defaultAuditHelpStatus } from '../config/AuditHelpConfig.js';
import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import AuditHelpModel from './models/AuditHelpModel.js';

/**
 * Creates a new AuditHelp entry in the database.
 *
 * @param {Object} auditHelp - The AuditHelp data to be created.
 * @returns {Object|null} The created AuditHelp object or null on error or if the AuditHelp model is not found.
 */
const createAuditHelp = async (auditHelp) => {
    try {
        AppLogger.info(
            `[AuditHelpProvider - createAuditHelp] auditHelp title:  ${auditHelp?.title}`,
        );
        if (!auditHelp?.title?.length) {
            return null;
        }

        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);

        if (!auditHelpModel) {
            return null;
        }

        const createdAuditHelp = await auditHelpModel.create(auditHelp);
        AppLogger.info(
            `[AuditHelpProvider - createAuditHelp] createdAuditHelp: ${createdAuditHelp?._id}`,
        );

        return createdAuditHelp;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - createAuditHelp] error:  ${error.message}`);
        return null;
    }
};

/**
 * Edits an existing AuditHelp entry in the database.
 *
 * @param {Object} auditHelp - The AuditHelp data with updated information.
 * @returns {Object|null} An object containing the ID of the edited AuditHelp or null on error or if the AuditHelp model is not found.
 */
const editAuditHelp = async (auditHelp) => {
    try {
        AppLogger.info(`[AuditHelpProvider - editAuditHelp] auditHelp id:  ${auditHelp?._id}`);
        AppLogger.info(`[AuditHelpProvider - editAuditHelp] auditHelp title:  ${auditHelp?.title}`);

        if (!auditHelp?._id || !auditHelp?.title?.length) {
            return null;
        }

        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);

        if (!auditHelpModel) {
            return null;
        }

        const editedAuditHelp = await auditHelpModel.update(auditHelp, {
            where: {
                _id: auditHelp?._id,
            },
        });

        AppLogger.info(
            `[AuditHelpProvider - editAuditHelp] editedAuditHelp: ${editedAuditHelp?._id}`,
        );

        return {
            _id: auditHelp?._id,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - editAuditHelp] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes an AuditHelp from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.auditHelpId - The ID of the AuditHelp to delete.
 * @returns {Object|null} An object containing the ID of the deleted AuditHelp, or null on error or if auditHelpId is not provided or if the AuditHelp model is not found.
 */
const deleteAuditHelp = async ({ auditHelpId }) => {
    try {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelp] auditHelpId:  ${auditHelpId}`);
        if (!auditHelpId) {
            return null;
        }

        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);

        if (!auditHelpModel) {
            return null;
        }

        await auditHelpModel.destroy({
            where: {
                _id: auditHelpId,
            },
        });

        return {
            _id: auditHelpId,
        };
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelp] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all AuditHelps from the database
 *
 * @returns {boolean} True if the deletion was successful, false otherwise
 */
const deleteAuditHelpList = async () => {
    try {
        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);
        if (!auditHelpModel) {
            return null;
        }

        await auditHelpModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - deleteAuditHelpList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves a list of AuditHelps, potentially paginated and sorted
 *
 * @param {Object} params - An object containing query parameters
 * @param {number} [params.start] - The starting index for pagination (optional)
 * @param {number} [params.limit] - The maximum number of AuditHelps to retrieve (optional)
 * @param {Object} [params.sort] - An object defining the sorting criteria (optional)
 * @returns {Promise<Model[]|Attributes<Model>[]|*[]|null>} An array of AuditHelp objects or null on error or if the AuditHelp model is not found
 */
const getAuditHelpListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);
        if (!auditHelpModel) {
            return null;
        }

        // Construct the query options based on provided arguments
        const queryOptions = {};

        // Handle pagination
        if (start !== undefined) {
            //queryOptions.offset = start;
        }

        if (limit !== undefined) {
            // queryOptions.limit = limit;
        }

        // Handle sorting
        if (sort) {
            // queryOptions.order = sort; // Assuming 'sort' specifies the sorting order directly
        }

        const auditHelpList = await auditHelpModel.findAll(queryOptions);
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpListByPageAndParams] auditHelpList: ${auditHelpList?.length}`,
        );

        return auditHelpList;
    } catch (error) {
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of an AuditHelp by its ID.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.auditHelpId - The ID of the AuditHelp to retrieve
 * @param {string} params.category - The category of the AuditHelp to retrieve
 * @returns {Object|null} The AuditHelp details or null if not found or on error or if the AuditHelp model is not found
 */
const getAuditHelpDetailsByParams = async ({ auditHelpId, category }) => {
    try {
        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpDetailsByParams] auditHelpId: ${auditHelpId}`,
        );
        AppLogger.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] category: ${category}`);

        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);

        if (!auditHelpModel) {
            return null;
        }

        const auditHelpDetails = auditHelpId?.length
            ? (
                  await auditHelpModel.findOne({
                      where: {
                          _id: auditHelpId,
                      },
                  })
              )?.dataValues
            : (
                  await auditHelpModel.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[AuditHelpProvider - getAuditHelpDetailsByParams] auditHelpDetails _id: ${auditHelpDetails?._id}`,
        );

        if (!auditHelpDetails?._id) {
            return null;
        }

        return auditHelpDetails;
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - getAuditHelpDetailsByParams] error: ${error.message}`);
        return null;
    }
};

/**
 * Initializes default audit help data in the database.
 *
 * Checks if audit help data already exists in the database.
 * If not, it creates new audit help entries using the `defaultAuditHelpStatus` data.
 *
 * @returns {Promise<boolean|null>} A promise that resolves to:
 *   - `true` if the initialization was successful or audit help data already exists.
 *   - `false` if there was an error during initialization.
 *   - `null` if the `auditHelpModel` is not found.
 */
const initDefaultData = async () => {
    try {
        const auditHelpModel = DataBaseManager.getDataBaseSchema(AuditHelpModel.name);

        if (!auditHelpModel) {
            return null;
        }

        const auditHelpCount = await auditHelpModel.count();

        AppLogger.info(`[AuditHelpProvider - initDefaultData] auditHelpCount:  ${auditHelpCount}`);

        if (auditHelpCount > 0) {
            return true;
        }

        for (const auditHelp of defaultAuditHelpStatus) {
            createAuditHelp(auditHelp);
        }

        return true; // Indicate successful initialization
    } catch (error) {
        AppLogger.info(`[AuditHelpProvider - initDefaultData] error:  ${error.message}`);
        return false;
    }
};

/**
 * An object that provides various operations related to AuditHelps.
 */
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

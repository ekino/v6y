import { defaultEvolutionHelpStatus } from '../config/EvolutionHelpStatusConfig.js';
import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import EvolutionHelpModel from './models/EvolutionHelpModel.js';

/**
 * Format EvolutionHelp
 * @param evolutionHelp
 * @returns {{description, links: *, _id: *, title}}
 */
const formatEvolutionHelpInput = (evolutionHelp) => ({
    _id: evolutionHelp._id,
    title: evolutionHelp.title,
    description: evolutionHelp.description,
    category: evolutionHelp.category,
    status: evolutionHelp.status,
    links: evolutionHelp.links
        ?.map((link) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Creates a new EvolutionHelp entry in the database.
 *
 * @param {Object} evolutionHelp - The EvolutionHelp data to be created.
 * @returns {Object|null} The created EvolutionHelp object or null on error or if the EvolutionHelp model is not found.
 */
const createEvolutionHelp = async (evolutionHelp) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - createEvolutionHelp] evolutionHelp title:  ${evolutionHelp?.title}`,
        );
        if (!evolutionHelp?.title?.length) {
            return null;
        }

        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);

        if (!evolutionHelpModel) {
            return null;
        }

        const createdEvolutionHelp = await evolutionHelpModel.create(
            formatEvolutionHelpInput(evolutionHelp),
        );
        AppLogger.info(
            `[EvolutionHelpProvider - createEvolutionHelp] createdEvolutionHelp: ${createdEvolutionHelp?._id}`,
        );

        return createdEvolutionHelp;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - createEvolutionHelp] error:  ${error.message}`);
        return null;
    }
};

/**
 * Edits an existing EvolutionHelp entry in the database.
 *
 * @param {Object} evolutionHelp - The EvolutionHelp data with updated information.
 * @returns {Object|null} An object containing the ID of the edited EvolutionHelp or null on error or if the EvolutionHelp model is not found.
 */
const editEvolutionHelp = async (evolutionHelp) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - editEvolutionHelp] evolutionHelp id:  ${evolutionHelp?._id}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - editEvolutionHelp] evolutionHelp title:  ${evolutionHelp?.title}`,
        );

        if (!evolutionHelp?._id || !evolutionHelp?.title?.length) {
            return null;
        }

        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);

        if (!evolutionHelpModel) {
            return null;
        }

        const editedEvolutionHelp = await evolutionHelpModel.update(
            formatEvolutionHelpInput(evolutionHelp),
            {
                where: {
                    _id: evolutionHelp?._id,
                },
            },
        );

        AppLogger.info(
            `[EvolutionHelpProvider - editEvolutionHelp] editedEvolutionHelp: ${editedEvolutionHelp?._id}`,
        );

        return {
            _id: evolutionHelp?.evolutionHelpId,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - editEvolutionHelp] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes an EvolutionHelp from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.evolutionHelpId - The ID of the EvolutionHelp to delete.
 * @returns {Object|null} An object containing the ID of the deleted EvolutionHelp, or null on error or if evolutionHelpId is not provided or if the EvolutionHelp model is not found.
 */
const deleteEvolutionHelp = async ({ evolutionHelpId }) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - deleteEvolutionHelp] evolutionHelpId:  ${evolutionHelpId}`,
        );
        if (!evolutionHelpId) {
            return null;
        }

        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);

        if (!evolutionHelpModel) {
            return null;
        }

        await evolutionHelpModel.destroy({
            where: {
                _id: evolutionHelpId,
            },
        });

        return {
            _id: evolutionHelpId,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - deleteEvolutionHelp] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all EvolutionHelps from the database
 *
 * @returns {boolean} True if the deletion was successful, false otherwise
 */
const deleteEvolutionHelpList = async () => {
    try {
        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);
        if (!evolutionHelpModel) {
            return null;
        }

        await evolutionHelpModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - deleteEvolutionHelpList] error:  ${error.message}`,
        );
        return false;
    }
};

/**
 * Retrieves a list of EvolutionHelps, potentially paginated and sorted
 *
 * @param {Object} params - An object containing query parameters
 * @param {number} [params.start] - The starting index for pagination (optional)
 * @param {number} [params.limit] - The maximum number of EvolutionHelps to retrieve (optional)
 * @param {Object} [params.sort] - An object defining the sorting criteria (optional)
 * @returns {Array|null} An array of EvolutionHelp objects or null on error or if the EvolutionHelp model is not found
 */
const getEvolutionHelpListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] sort: ${sort}`,
        );

        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);
        if (!evolutionHelpModel) {
            return null;
        }

        // Construct the query options based on provided arguments
        const queryOptions = {};

        // Handle pagination
        if (start) {
            queryOptions.offset = start;
        }

        if (limit) {
            queryOptions.limit = limit;
        }

        const evolutionHelpList = await evolutionHelpModel.findAll(queryOptions);

        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] evolutionHelpList: ${evolutionHelpList?.length}`,
        );

        return evolutionHelpList;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of an EvolutionHelp by its ID.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.evolutionHelpId - The ID of the EvolutionHelp to retrieve
 * @param {string} params.category - The category of the EvolutionHelp to retrieve
 * @returns {Object|null} The EvolutionHelp details or null if not found or on error or if the EvolutionHelp model is not found
 */
const getEvolutionHelpDetailsByParams = async ({ evolutionHelpId, category }) => {
    try {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] evolutionHelpId: ${evolutionHelpId}`,
        );
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] category: ${category}`,
        );

        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);
        if (!evolutionHelpModel) {
            return null;
        }

        const evolutionHelpDetails = evolutionHelpId
            ? (
                  await evolutionHelpModel.findOne({
                      where: {
                          _id: evolutionHelpId,
                      },
                  })
              )?.dataValues
            : (
                  await evolutionHelpModel.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] evolutionHelpDetails _id: ${evolutionHelpDetails?._id}`,
        );

        if (!evolutionHelpDetails?._id) {
            return null;
        }

        return evolutionHelpDetails;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * Initializes default evolution help data in the database.
 *
 * Checks if evolution help data already exists in the database.
 * If not, it creates new evolution help entries using the `defaultEvolutionHelpStatus` data.
 *
 * @returns {Promise<boolean|null>} A promise that resolves to:
 *   - `true` if the initialization was successful or evolution help data already exists.
 *   - `false` if there was an error during initialization.
 *   - `null` if the `evolutionHelpModel` is not found.
 */
const initDefaultData = async () => {
    try {
        const evolutionHelpModel = DataBaseManager.getDataBaseSchema(EvolutionHelpModel.name);

        if (!evolutionHelpModel) {
            return null;
        }

        const evolutionHelpCount = await evolutionHelpModel.count();

        AppLogger.info(
            `[EvolutionHelpProvider - initDefaultData] evolutionHelpCount:  ${evolutionHelpCount}`,
        );

        if (evolutionHelpCount > 0) {
            return true;
        }

        for (const evolutionHelp of defaultEvolutionHelpStatus) {
            createEvolutionHelp(evolutionHelp);
        }

        return true;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - initDefaultData] error:  ${error.message}`);
        return false;
    }
};

/**
 * An object that provides various operations related to EvolutionHelps.
 */
const EvolutionHelpProvider = {
    initDefaultData,
    createEvolutionHelp,
    editEvolutionHelp,
    deleteEvolutionHelp,
    deleteEvolutionHelpList,
    getEvolutionHelpListByPageAndParams,
    getEvolutionHelpDetailsByParams,
};

export default EvolutionHelpProvider;

import { defaultDependencyStatusHelp } from '../config/DependencyStatusHelpConfig.js';
import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import DependencyStatusHelpModel from './models/DependencyStatusHelpModel.js';

/**
 * Format DependencyStatusHelp
 * @param dependencyStatusHelp
 * @returns {{description, links: *, _id: *, title}}
 */
const formatDependencyStatusHelpInput = (dependencyStatusHelp) => ({
    _id: dependencyStatusHelp?._id,
    title: dependencyStatusHelp.title,
    description: dependencyStatusHelp.description,
    category: dependencyStatusHelp.category,
    links: dependencyStatusHelp.links
        ?.map((link) => ({
            label: 'More Information',
            value: link,
            description: '',
        }))
        ?.filter((item) => item?.value),
});

/**
 * Creates a new DependencyStatusHelp entry in the database.
 *
 * @param {Object} dependencyStatusHelp - The DependencyStatusHelp data to be created.
 * @returns {Object|null} The created DependencyStatusHelp object or null on error or if the DependencyStatusHelp model is not found.
 */
const createDependencyStatusHelp = async (dependencyStatusHelp) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - createDependencyStatusHelp] dependencyStatusHelp title:  ${dependencyStatusHelp?.title}`,
        );
        if (!dependencyStatusHelp?.title?.length) {
            return null;
        }

        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );

        if (!dependencyStatusHelpModel) {
            return null;
        }

        const createdDependencyStatusHelp = await dependencyStatusHelpModel.create(
            formatDependencyStatusHelpInput(dependencyStatusHelp),
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - createDependencyStatusHelp] createdDependencyStatusHelp: ${createdDependencyStatusHelp?._id}`,
        );

        return createdDependencyStatusHelp;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - createDependencyStatusHelp] error:  ${error.message}`,
        );
        return null;
    }
};

/**
 * Edits an existing DependencyStatusHelp entry in the database.
 *
 * @param {Object} dependencyStatusHelp - The DependencyStatusHelp data with updated information.
 * @returns {Object|null} An object containing the ID of the edited DependencyStatusHelp or null on error or if the DependencyStatusHelp model is not found.
 */
const editDependencyStatusHelp = async (dependencyStatusHelp) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] dependencyStatusHelp id:  ${dependencyStatusHelp?._id}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] dependencyStatusHelp title:  ${dependencyStatusHelp?.title}`,
        );

        if (!dependencyStatusHelp?._id || !dependencyStatusHelp?.title?.length) {
            return null;
        }

        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );

        if (!dependencyStatusHelpModel) {
            return null;
        }

        const editedDependencyStatusHelp = await dependencyStatusHelpModel.update(
            formatDependencyStatusHelpInput(dependencyStatusHelp),
            {
                where: {
                    _id: dependencyStatusHelp?._id,
                },
            },
        );

        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] editedDependencyStatusHelp: ${editedDependencyStatusHelp?._id}`,
        );

        return {
            _id: dependencyStatusHelp?.dependencyStatusHelpId,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - editDependencyStatusHelp] error:  ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes an DependencyStatusHelp from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.dependencyStatusHelpId - The ID of the DependencyStatusHelp to delete.
 * @returns {Object|null} An object containing the ID of the deleted DependencyStatusHelp, or null on error or if dependencyStatusHelpId is not provided or if the DependencyStatusHelp model is not found.
 */
const deleteDependencyStatusHelp = async ({ dependencyStatusHelpId }) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - deleteDependencyStatusHelp] dependencyStatusHelpId:  ${dependencyStatusHelpId}`,
        );
        if (!dependencyStatusHelpId) {
            return null;
        }

        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );

        if (!dependencyStatusHelpModel) {
            return null;
        }

        await dependencyStatusHelpModel.destroy({
            where: {
                _id: dependencyStatusHelpId,
            },
        });

        return {
            _id: dependencyStatusHelpId,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - deleteDependencyStatusHelp] error:  ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes all DependencyStatusHelps from the database
 *
 * @returns {boolean} True if the deletion was successful, false otherwise
 */
const deleteDependencyStatusHelpList = async () => {
    try {
        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );
        if (!dependencyStatusHelpModel) {
            return null;
        }

        await dependencyStatusHelpModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - deleteDependencyStatusHelpList] error:  ${error.message}`,
        );
        return false;
    }
};

/**
 * Retrieves a list of DependencyStatusHelps, potentially paginated and sorted
 *
 * @param {Object} params - An object containing query parameters
 * @param {number} [params.start] - The starting index for pagination (optional)
 * @param {number} [params.limit] - The maximum number of DependencyStatusHelps to retrieve (optional)
 * @param {Object} [params.sort] - An object defining the sorting criteria (optional)
 * @returns {Promise<Model[]|Attributes<Model>[]|*[]|null>} An array of DependencyStatusHelp objects or null on error or if the DependencyStatusHelp model is not found
 */
const getDependencyStatusHelpListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] sort: ${sort}`,
        );

        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );
        if (!dependencyStatusHelpModel) {
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

        const dependencyStatusHelpList = await dependencyStatusHelpModel.findAll(queryOptions);
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] dependencyStatusHelpList: ${dependencyStatusHelpList?.length}`,
        );

        return dependencyStatusHelpList;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of an DependencyStatusHelp by its ID.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.dependencyStatusHelpId - The ID of the DependencyStatusHelp to retrieve
 * @param {string} params.category - The category of the DependencyStatusHelp to retrieve
 * @returns {Object|null} The DependencyStatusHelp details or null if not found or on error or if the DependencyStatusHelp model is not found
 */
const getDependencyStatusHelpDetailsByParams = async ({ dependencyStatusHelpId, category }) => {
    try {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] dependencyStatusHelpId: ${dependencyStatusHelpId}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] category: ${category}`,
        );

        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );

        if (!dependencyStatusHelpModel) {
            return null;
        }

        const dependencyStatusHelpDetails = dependencyStatusHelpId
            ? (
                  await dependencyStatusHelpModel.findOne({
                      where: {
                          _id: dependencyStatusHelpId,
                      },
                  })
              )?.dataValues
            : (
                  await dependencyStatusHelpModel.findOne({
                      where: {
                          category,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] dependencyStatusHelpDetails _id: ${dependencyStatusHelpDetails?._id}`,
        );

        if (!dependencyStatusHelpDetails?._id) {
            return null;
        }

        return dependencyStatusHelpDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpProvider - getDependencyStatusHelpDetailsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * Initializes default dependency status help data in the database.
 *
 * This function checks if dependency status help data already exists.
 * If not, it creates new entries using the `defaultDependencyStatusHelp` data.
 *
 * @returns {Promise<boolean|null>} A promise that resolves to:
 *   - `true` if the initialization was successful or data already exists.
 *   - `false` if there was an error during initialization.
 *   - `null` if the `dependencyStatusHelpModel` is not found.
 */
const initDefaultData = async () => {
    try {
        const dependencyStatusHelpModel = DataBaseManager.getDataBaseSchema(
            DependencyStatusHelpModel.name,
        );

        if (!dependencyStatusHelpModel) {
            return null;
        }

        const dependencyStatusHelpCount = await dependencyStatusHelpModel.count();

        AppLogger.info(
            `[DependencyStatusHelpProvider - initDefaultData] dependencyStatusHelpCount:  ${dependencyStatusHelpCount}`,
        );

        if (dependencyStatusHelpCount > 0) {
            return true;
        }

        for (const dependencyStatusHelp of defaultDependencyStatusHelp) {
            createDependencyStatusHelp(dependencyStatusHelp); // Assuming 'createDependencyStatusHelp' is defined elsewhere
        }

        return true;
    } catch (error) {
        AppLogger.info(`[DependencyStatusHelpProvider - initDefaultData] error:  ${error.message}`);
        return false;
    }
};

/**
 * An object that provides various operations related to DependencyStatusHelps.
 */
const DependencyStatusHelpProvider = {
    initDefaultData,
    createDependencyStatusHelp,
    editDependencyStatusHelp,
    deleteDependencyStatusHelp,
    deleteDependencyStatusHelpList,
    getDependencyStatusHelpListByPageAndParams,
    getDependencyStatusHelpDetailsByParams,
};

export default DependencyStatusHelpProvider;

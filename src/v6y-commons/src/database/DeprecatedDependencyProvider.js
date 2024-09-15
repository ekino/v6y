import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import DeprecatedDependencyModel from './models/DeprecatedDependencyModel.js';

/**
 * Creates a new DeprecatedDependency entry in the database.
 *
 * @param {Object} deprecatedDependency - The DeprecatedDependency data to be created.
 * @returns {Object|null} The created DeprecatedDependency object or null on error or if the DeprecatedDependency model is not found.
 */
const createDeprecatedDependency = async (deprecatedDependency) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - createDeprecatedDependency] deprecatedDependency name:  ${deprecatedDependency?.name}`,
        );

        if (!deprecatedDependency?.name?.length) {
            return null;
        }

        const deprecatedDependencyModel = DataBaseManager.getDataBaseSchema(
            DeprecatedDependencyModel.name,
        );

        if (!deprecatedDependencyModel) {
            return null;
        }

        const createdDeprecatedDependency =
            await deprecatedDependencyModel.create(deprecatedDependency);
        AppLogger.info(
            `[DeprecatedDependencyProvider - createDeprecatedDependency] createdDeprecatedDependency _id: ${createdDeprecatedDependency?._id}`,
        );

        return createdDeprecatedDependency;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - createDeprecatedDependency] error:  ${error.message}`,
        );
        return null;
    }
};

/**
 * Edits an existing DeprecatedDependency entry in the database.
 *
 * @param {Object} deprecatedDependency - The DeprecatedDependency data with updated information.
 * @returns {Object|null} An object containing the ID of the edited DeprecatedDependency or null on error or if the DeprecatedDependency model is not found.
 */
const editDeprecatedDependency = async (deprecatedDependency) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] deprecatedDependency id:  ${deprecatedDependency?._id}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] deprecatedDependency name:  ${deprecatedDependency?.name}`,
        );

        if (!deprecatedDependency?._id || !deprecatedDependency?.name?.length) {
            return null;
        }

        const deprecatedDependencyModel = DataBaseManager.getDataBaseSchema(
            DeprecatedDependencyModel.name,
        );

        if (!deprecatedDependencyModel) {
            return null;
        }

        const editedDeprecatedDependency = await deprecatedDependencyModel.update(
            deprecatedDependency,
            {
                where: {
                    _id: deprecatedDependency?._id,
                },
            },
        );

        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] editedDeprecatedDependency: ${editedDeprecatedDependency?._id}`,
        );

        return {
            _id: deprecatedDependency?.deprecatedDependencyId,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - editDeprecatedDependency] error:  ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes an DeprecatedDependency from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.deprecatedDependencyId - The ID of the DeprecatedDependency to delete.
 * @returns {Object|null} An object containing the ID of the deleted DeprecatedDependency, or null on error or if deprecatedDependencyId is not provided or if the DeprecatedDependency model is not found.
 */
const deleteDeprecatedDependency = async ({ deprecatedDependencyId }) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - deleteDeprecatedDependency] deprecatedDependencyId:  ${deprecatedDependencyId}`,
        );
        if (!deprecatedDependencyId) {
            return null;
        }

        const deprecatedDependencyModel = DataBaseManager.getDataBaseSchema(
            DeprecatedDependencyModel.name,
        );

        if (!deprecatedDependencyModel) {
            return null;
        }

        await deprecatedDependencyModel.destroy({
            where: {
                _id: deprecatedDependencyId,
            },
        });

        return {
            _id: deprecatedDependencyId,
        };
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - deleteDeprecatedDependency] error:  ${error.message}`,
        );
        return null;
    }
};

/**
 * Deletes all Deprecated Dependencies from the database
 *
 * @returns {boolean} True if the deletion was successful, false otherwise
 */
const deleteDeprecatedDependencyList = async () => {
    try {
        const deprecatedDependencyModel = DataBaseManager.getDataBaseSchema(
            DeprecatedDependencyModel.name,
        );

        if (!deprecatedDependencyModel) {
            return null;
        }

        await deprecatedDependencyModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - deleteDeprecatedDependencyList] error:  ${error.message}`,
        );
        return false;
    }
};

/**
 * Retrieves a list of Deprecated Dependencies, potentially paginated and sorted
 *
 * @param {Object} params - An object containing query parameters
 * @param {number} [params.start] - The starting index for pagination (optional)
 * @param {number} [params.limit] - The maximum number of Deprecated Dependencies to retrieve (optional)
 * @param {Object} [params.sort] - An object defining the sorting criteria (optional)
 * @returns {Array|null} An array of DeprecatedDependency objects or null on error or if the DeprecatedDependency model is not found
 */
const getDeprecatedDependencyListByPageAndParams = async ({ start, limit, sort }) => {
    try {
        const deprecatedDependencyModel = DataBaseManager.getDataBaseSchema(
            DeprecatedDependencyModel.name,
        );

        if (!deprecatedDependencyModel) {
            return null;
        }

        // Construct the query options based on provided arguments
        const queryOptions = {};

        // Handle pagination
        if (start !== undefined) {
            // queryOptions.offset = start;
        }

        if (limit !== undefined) {
            //    queryOptions.limit = limit;
        }

        // Handle sorting
        if (sort) {
            // queryOptions.order = sort; // Assuming 'sort' specifies the sorting order directly
        }

        const deprecatedDependencyList = await deprecatedDependencyModel.findAll(queryOptions);
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] deprecatedDependencyList: ${deprecatedDependencyList?.length}`,
        );

        return deprecatedDependencyList;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of an DeprecatedDependency by its ID.
 *
 * @param {Object} params - An object containing the parameters for the query
 * @param {string} params.deprecatedDependencyId - The ID of the DeprecatedDependency to retrieve
 * @param {string} params.name - The name of the DeprecatedDependency to retrieve
 * @returns {Object|null} The DeprecatedDependency details or null if not found or on error or if the DeprecatedDependency model is not found
 */
const getDeprecatedDependencyDetailsByParams = async ({ deprecatedDependencyId, name }) => {
    try {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] deprecatedDependencyId: ${deprecatedDependencyId}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] name: ${name}`,
        );

        const deprecatedDependencyModel = DataBaseManager.getDataBaseSchema(
            DeprecatedDependencyModel.name,
        );

        if (!deprecatedDependencyModel) {
            return null;
        }

        const deprecatedDependencyDetails = deprecatedDependencyModel?.length
            ? (
                  await deprecatedDependencyModel.findOne({
                      where: {
                          _id: deprecatedDependencyId,
                      },
                  })
              )?.dataValues
            : (
                  await deprecatedDependencyModel.findOne({
                      where: {
                          name,
                      },
                  })
              )?.dataValues;

        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] deprecatedDependencyDetails _id: ${deprecatedDependencyDetails?._id}`,
        );

        if (!deprecatedDependencyDetails?._id) {
            return null;
        }

        return deprecatedDependencyDetails;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyProvider - getDeprecatedDependencyDetailsByParams] error: ${error.message}`,
        );
        return null;
    }
};

/**
 * An object that provides various operations related to Deprecated Dependencies.
 */
const DeprecatedDependencyProvider = {
    createDeprecatedDependency,
    editDeprecatedDependency,
    deleteDeprecatedDependency,
    deleteDeprecatedDependencyList,
    getDeprecatedDependencyListByPageAndParams,
    getDeprecatedDependencyDetailsByParams,
};

export default DeprecatedDependencyProvider;

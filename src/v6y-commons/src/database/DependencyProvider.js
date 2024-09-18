import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.js';
import DependencyModel from './models/DependencyModel.js';

/**
 * Creates a new Dependency entry in the database.
 *
 * @param {Object} dependency - The Dependency data to be created.
 * @returns {Promise<*|null>} The created Dependency object or null on error or if the Dependency model is not found.
 */
const createDependency = async (dependency) => {
    try {
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency type:  ${dependency?.type}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency name:  ${dependency?.name}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency version:  ${dependency?.version}`,
        );

        if (
            !dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length
        ) {
            return null;
        }

        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);

        if (!dependencyModel) {
            return null;
        }

        const depStatusHelp =
            await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                category: dependency.status,
            });

        const createdDependency = await dependencyModel.create({
            ...dependency,
            appId: dependency.module?.appId,
            statusHelp: depStatusHelp,
        });
        AppLogger.info(
            `[DependencyProvider - createDependency] createdDependency: ${createdDependency?._id}`,
        );

        return createdDependency;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - createDependency] error:  ${error.message}`);
        return null;
    }
};

/**
 * Bulk insert of dependencyList list
 * @param {Array} dependencyList
 * @returns {Promise<null>}
 */
const insertDependencyList = async (dependencyList) => {
    try {
        AppLogger.info(
            `[DependencyProvider - insertDependencyList] dependencyList:  ${dependencyList?.length}`,
        );
        if (!dependencyList?.length) {
            return null;
        }

        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);

        if (!dependencyModel) {
            return null;
        }

        for (const dependency of dependencyList) {
            await createDependency(dependency);
        }

        AppLogger.info(
            `[DependencyProvider - insertDependencyList] dependencyList list inserted successfully`,
        );
    } catch (error) {
        AppLogger.info(`[DependencyProvider - insertDependencyList] error:  ${error.message}`);
    }
};

/**
 * Edits an existing Dependency entry in the database.
 *
 * @param {Object} dependency - The Dependency data with updated information.
 * @returns {Promise<*|null>} An object containing the ID of the edited Dependency or null on error or if the Dependency model is not found.
 */
const editDependency = async (dependency) => {
    try {
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency _id:  ${dependency?._id}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency type:  ${dependency?.type}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency name:  ${dependency?.name}`,
        );
        AppLogger.info(
            `[DependencyProvider - createDependency] dependency version:  ${dependency?.version}`,
        );

        if (
            !dependency?._id ||
            !dependency?.type?.length ||
            !dependency?.name?.length ||
            !dependency?.version?.length
        ) {
            return null;
        }

        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);

        if (!dependencyModel) {
            return null;
        }

        const editedDependency = await dependencyModel.update(dependency, {
            where: {
                _id: dependency?._id,
            },
        });

        AppLogger.info(
            `[DependencyProvider - editDependency] editedDependency: ${editedDependency?._id}`,
        );

        return {
            _id: dependency?._id,
        };
    } catch (error) {
        AppLogger.info(`[DependencyProvider - editDependency] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes a Dependency from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.dependencyId - The ID of the Dependency to delete.
 * @returns {Promise<*|null>} An object containing the ID of the deleted Dependency, or null on error or if dependencyId is not provided or if the Dependency model is not found.
 */
const deleteDependency = async ({ dependencyId }) => {
    try {
        AppLogger.info(`[DependencyProvider - deleteDependency] dependencyId:  ${dependencyId}`);
        if (!dependencyId) {
            return null;
        }

        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);

        if (!dependencyModel) {
            return null;
        }

        await dependencyModel.destroy({
            where: {
                _id: dependencyId,
            },
        });

        return {
            _id: dependencyId,
        };
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependency] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all Dependencies from the database
 *
 * @returns {Promise<boolean|null>} True if the deletion was successful, false otherwise
 */
const deleteDependencyList = async () => {
    try {
        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);
        if (!dependencyModel) {
            return null;
        }

        await dependencyModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[DependencyProvider - deleteDependencyList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves a list of dependencies based on the provided appId.
 *
 * @param {Object} params - Parameters object containing the appId.
 * @param {string | undefined} params.appId - The ID of the application to retrieve dependencies for.
 * @returns {Promise<Array>} A Promise resolving to an array of dependencies, or an empty array in case of an error.
 */
const getDependencyListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger.info(`[DependencyProvider - getDependencyListByPageAndParams] appId: ${appId}`);

        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);
        if (!dependencyModel) {
            return null;
        }

        const queryOptions = {};

        if (appId) {
            queryOptions.where = {
                appId,
            };
        }

        const dependencyList = await dependencyModel.findAll(queryOptions);
        AppLogger.info(
            `[DependencyProvider - getDependencyListByPageAndParams] dependencyList: ${dependencyList?.length}`,
        );

        return dependencyList;
    } catch (error) {
        AppLogger.info(
            `[DependencyProvider - getDependencyListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * An object that provides various operations related to Dependencies.
 */
const DependencyProvider = {
    createDependency,
    insertDependencyList,
    editDependency,
    deleteDependency,
    deleteDependencyList,
    getDependencyListByPageAndParams,
};

export default DependencyProvider;

import { dependencyStatus } from '../config/data/DependencyStatusHelpConfig.js';
import AppLogger from '../core/AppLogger.js';
import DataBaseManager from './DataBaseManager.js';
import DependencyStatusHelpProvider from './DependencyStatusHelpProvider.js';
import DeprecatedDependencyProvider from './DeprecatedDependencyProvider.js';
import DependencyModel from './models/DependencyModel.js';

const dependencyRecommendedVersions = {
    react: '17.0.2',
    'react-dom': '17.0.2',
    'react-hot-loader': '4.13.0',
    'react-router-dom': '5.3.0',
    '@babel/preset-typescript': '7.16.7',
    '@types/chai': '4.3.1',
    '@types/enzyme': '3.10.12',
    '@types/jest': '27.5.1',
    '@typescript-eslint/eslint-plugin': '5.12.1',
    '@typescript-eslint/parser': '5.12.1',
};

/**
 * Creates a new Dependency entry in the database.
 *
 * @param {Object} dependency - The Dependency data to be created.
 * @returns {Object|null} The created Dependency object or null on error or if the Dependency model is not found.
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

        const createdDependency = await dependencyModel.create(dependency);
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
 * Edits an existing Dependency entry in the database.
 *
 * @param {Object} dependency - The Dependency data with updated information.
 * @returns {Object|null} An object containing the ID of the edited Dependency or null on error or if the Dependency model is not found.
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
 * @returns {Object|null} An object containing the ID of the deleted Dependency, or null on error or if dependencyId is not provided or if the Dependency model is not found.
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
 * Prepares dependency information including its status, help message, and recommended version.
 *
 * @param {Object} params - Parameters object.
 * @param {Object} params.dependency - The dependency object containing details such as name.
 * @returns {Promise<Object>} A Promise resolving to an object containing the dependency's status,
 * status help message, and recommended version.
 * @async
 */
const prepareDependency = async ({ dependency }) => {
    const isDeprecated = await DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams({
        name: dependency.name,
    });

    const isOutDated = false; // TODO: semver compare with bistro

    let depStatus = dependencyStatus['up-to-date'];
    if (isDeprecated) {
        depStatus = dependencyStatus.deprecated;
    } else if (isOutDated) {
        depStatus = dependencyStatus.outdated;
    }

    const depStatusHelp = await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams(
        {
            category: depStatus,
        },
    );

    const depRecommendedVersion = dependencyRecommendedVersions[dependency.name] || '';

    return {
        status: depStatus,
        statusHelp: depStatusHelp,
        recommendedVersion: depRecommendedVersion,
    };
};

/**
 * Retrieves a list of dependencies based on the provided appId.
 *
 * @param {Object} params - Parameters object containing the appId.
 * @param {string} params.appId - The ID of the application to retrieve dependencies for.
 * @returns {Promise<Array>} A Promise resolving to an array of dependencies, or an empty array in case of an error.
 */
const getDependencyListByPageAndParams = async ({ appId }) => {
    try {
        const dependencyModel = DataBaseManager.getDataBaseSchema(DependencyModel.name);
        if (!dependencyModel) {
            return null;
        }

        const dependencyListByParams = await dependencyModel.findAll({
            where: {
                _id: appId,
            },
        });

        AppLogger.info(
            `[DependencyProvider - getDependencyListByPageAndParams] dependencyListByParams: ${dependencyListByParams?.length}`,
        );

        if (!dependencyListByParams?.length) {
            return null;
        }

        const dependencyList = [];

        for (const dependency of dependencyListByParams) {
            const updatedDependency = await prepareDependency(dependency);
            dependencyList.push({
                ...dependency,
                ...(updatedDependency || {}),
            });
        }

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
    editDependency,
    deleteDependency,
    deleteDependencyList,
    getDependencyListByPageAndParams,
};

export default DependencyProvider;

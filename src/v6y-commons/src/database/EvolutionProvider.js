import AppLogger from '../core/AppLogger.js';
import { EvolutionHelpProvider } from '../index.js';
import DataBaseManager from './DataBaseManager.js';
import EvolutionModel from './models/EvolutionModel.js';

/**
 * Creates a new Evolution entry in the database.
 *
 * @param {Object} evolution - The Evolution data to be created.
 * @returns {Promise<*|null>} The created Evolution object or null on error or if the Evolution model is not found.
 */
const createEvolution = async (evolution) => {
    try {
        AppLogger.info(
            `[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`,
        );

        if (!evolution?.category?.length) {
            return null;
        }

        const evolutionModel = DataBaseManager.getDataBaseSchema(EvolutionModel.name);

        if (!evolutionModel) {
            return null;
        }

        const evolutionHelp = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            category: evolution?.category,
        });

        const createdEvolution = await evolutionModel.create({
            ...evolution,
            appId: evolution.module?.appId,
            evolutionHelp,
        });
        AppLogger.info(
            `[EvolutionProvider - createEvolution] createdEvolution: ${createdEvolution?._id}`,
        );

        return createdEvolution;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - createEvolution] error:  ${error.message}`);
        return null;
    }
};

/**
 * Bulk insert of evolutionList list
 * @param {Array} evolutionList
 * @returns {Promise<null>}
 */
const insertEvolutionList = async (evolutionList) => {
    try {
        AppLogger.info(
            `[EvolutionProvider - insertEvolutionList] evolutionList:  ${evolutionList?.length}`,
        );
        if (!evolutionList?.length) {
            return null;
        }

        const evolutionModel = DataBaseManager.getDataBaseSchema(EvolutionModel.name);

        if (!evolutionModel) {
            return null;
        }

        for (const evolution of evolutionList) {
            await createEvolution(evolution);
        }

        AppLogger.info(
            `[EvolutionProvider - insertEvolutionList] evolutionList list inserted successfully`,
        );
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - insertEvolutionList] error:  ${error.message}`);
    }
};

/**
 * Edits an existing Evolution entry in the database.
 *
 * @param {Object} evolution - The Evolution data with updated information.
 * @returns {Promise<*|null>} An object containing the ID of the edited Evolution or null on error or if the Evolution model is not found.
 */
const editEvolution = async (evolution) => {
    try {
        AppLogger.info(`[EvolutionProvider - createEvolution] evolution _id:  ${evolution?._id}`);
        AppLogger.info(
            `[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`,
        );

        if (!evolution?._id || !evolution?.category?.length) {
            return null;
        }

        const evolutionModel = DataBaseManager.getDataBaseSchema(EvolutionModel.name);

        if (!evolutionModel) {
            return null;
        }

        const editedEvolution = await evolutionModel.update(evolution, {
            where: {
                _id: evolution?._id,
            },
        });

        AppLogger.info(
            `[EvolutionProvider - editEvolution] editedEvolution: ${editedEvolution?._id}`,
        );

        return {
            _id: evolution?._id,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - editEvolution] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes an Evolution from the database.
 *
 * @param {Object} params - An object containing the parameters for deletion.
 * @param {string} params.evolutionId - The ID of the Evolution to delete.
 * @returns {Promise<*|null>} An object containing the ID of the deleted Evolution, or null on error or if evolutionId is not provided or if the Evolution model is not found.
 */
const deleteEvolution = async ({ evolutionId }) => {
    try {
        AppLogger.info(`[EvolutionProvider - deleteEvolution] evolutionId:  ${evolutionId}`);
        if (!evolutionId) {
            return null;
        }

        const evolutionModel = DataBaseManager.getDataBaseSchema(EvolutionModel.name);

        if (!evolutionModel) {
            return null;
        }

        await evolutionModel.destroy({
            where: {
                _id: evolutionId,
            },
        });

        return {
            _id: evolutionId,
        };
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolution] error:  ${error.message}`);
        return null;
    }
};

/**
 * Deletes all Evolutions from the database
 *
 * @returns {Promise<boolean|null>} True if the deletion was successful, false otherwise
 */
const deleteEvolutionList = async () => {
    try {
        const evolutionModel = DataBaseManager.getDataBaseSchema(EvolutionModel.name);
        if (!evolutionModel) {
            return null;
        }

        await evolutionModel.destroy({
            truncate: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolutionList] error:  ${error.message}`);
        return false;
    }
};

/**
 * Retrieves a list of evolutions based on the provided appId.
 *
 * @param {Object} params - Parameters object containing the appId.
 * @param {string} params.appId - The ID of the application to retrieve evolutions for.
 * @returns {Promise<Array>} A Promise resolving to an array of evolutions, or an empty array in case of an error.
 */
const getEvolutionListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger.info(`[EvolutionProvider - getEvolutionListByPageAndParams] appId: ${appId}`);

        const evolutionModel = DataBaseManager.getDataBaseSchema(EvolutionModel.name);
        if (!evolutionModel) {
            return null;
        }

        const queryOptions = {};

        if (appId) {
            queryOptions.where = {
                appId,
            };
        }

        const evolutionList = await evolutionModel.findAll(queryOptions);
        AppLogger.info(
            `[EvolutionProvider - getEvolutionListByPageAndParams] evolutionList: ${evolutionList?.length}`,
        );

        return evolutionList;
    } catch (error) {
        AppLogger.info(
            `[EvolutionProvider - getEvolutionListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

/**
 * An object that provides various operations related to Evolutions.
 */
const EvolutionProvider = {
    createEvolution,
    insertEvolutionList,
    editEvolution,
    deleteEvolution,
    deleteEvolutionList,
    getEvolutionListByPageAndParams,
};

export default EvolutionProvider;

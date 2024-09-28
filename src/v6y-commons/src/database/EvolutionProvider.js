import AppLogger from '../core/AppLogger.ts';
import EvolutionHelpProvider from './EvolutionHelpProvider.ts';
import { EvolutionModelType } from './models/EvolutionModel.ts';
/**
 * Creates a new Evolution in the database
 * @param evolution
 */
const createEvolution = async (evolution) => {
    try {
        AppLogger.info(`[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`);
        if (!evolution?.category?.length) {
            return null;
        }
        const evolutionHelp = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            category: evolution?.category,
        });
        const createdEvolution = await EvolutionModelType.create({
            ...evolution,
            appId: evolution.module?.appId,
            evolutionHelp,
        });
        AppLogger.info(`[EvolutionProvider - createEvolution] createdEvolution: ${createdEvolution?._id}`);
        return createdEvolution;
    }
    catch (error) {
        AppLogger.info(`[EvolutionProvider - createEvolution] error:  ${error}`);
        return null;
    }
};
/**
 * Inserts a list of Evolutions in the database
 * @param evolutionList
 */
const insertEvolutionList = async (evolutionList) => {
    try {
        AppLogger.info(`[EvolutionProvider - insertEvolutionList] evolutionList:  ${evolutionList?.length}`);
        if (!evolutionList?.length) {
            return null;
        }
        for (const evolution of evolutionList) {
            await createEvolution(evolution);
        }
        AppLogger.info(`[EvolutionProvider - insertEvolutionList] evolutionList list inserted successfully`);
    }
    catch (error) {
        AppLogger.info(`[EvolutionProvider - insertEvolutionList] error:  ${error}`);
    }
};
/**
 * Edits an existing Evolution in the database
 * @param evolution
 */
const editEvolution = async (evolution) => {
    try {
        AppLogger.info(`[EvolutionProvider - createEvolution] evolution _id:  ${evolution?._id}`);
        AppLogger.info(`[EvolutionProvider - createEvolution] evolution category:  ${evolution?.category}`);
        if (!evolution?._id || !evolution?.category?.length) {
            return null;
        }
        const editedEvolution = await EvolutionModelType.update(evolution, {
            where: {
                _id: evolution?._id,
            },
        });
        AppLogger.info(`[EvolutionProvider - editEvolution] editedEvolution: ${editedEvolution?.[0]}`);
        return {
            _id: evolution?._id,
        };
    }
    catch (error) {
        AppLogger.info(`[EvolutionProvider - editEvolution] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes an existing Evolution in the database
 * @param _id
 */
const deleteEvolution = async ({ _id }) => {
    try {
        AppLogger.info(`[EvolutionProvider - deleteEvolution] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await EvolutionModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolution] error:  ${error}`);
        return null;
    }
};
/**
 * Deletes all Evolutions in the database
 */
const deleteEvolutionList = async () => {
    try {
        await EvolutionModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolutionList] error:  ${error}`);
        return false;
    }
};
/**
 * Fetches a list of Evolutions from the database
 * @param appId
 */
const getEvolutionListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger.info(`[EvolutionProvider - getEvolutionListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const evolutionList = await EvolutionModelType.findAll(queryOptions);
        AppLogger.info(`[EvolutionProvider - getEvolutionListByPageAndParams] evolutionList: ${evolutionList?.length}`);
        return evolutionList;
    }
    catch (error) {
        AppLogger.info(`[EvolutionProvider - getEvolutionListByPageAndParams] error:  ${error}`);
        return [];
    }
};
const EvolutionProvider = {
    createEvolution,
    insertEvolutionList,
    editEvolution,
    deleteEvolution,
    deleteEvolutionList,
    getEvolutionListByPageAndParams,
};
export default EvolutionProvider;

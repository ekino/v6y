import { evolutions, keywords } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertEvolution = async (evolution) => {
    try {
        AppLogger.info(`[insertEvolution] evolution title:  ${evolution?.title}`);
        if (!evolution?.title?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[insertEvolution] error:  ${error.message}`);
        return {};
    }
};

const insertEvolutionList = async (evolutionList) => {
    try {
        if (!evolutionList?.length) {
            return;
        }

        for (const evolution of evolutionList) {
            await insertEvolution(evolution);
        }
    } catch (error) {
        AppLogger.info(`[insertEvolutionList] error:  ${error.message}`);
    }
};

const deleteEvolutionsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteEvolutionsList] error:  ${error.message}`);
    }
};

const getEvolutionByParams = async ({ evolutionId }) => {
    try {
        // read from DB

        return evolutionId?.length > 0
            ? evolutions?.find((evolution) => evolution._id === evolutionId)
            : {};
    } catch (error) {
        AppLogger.info(`[getEvolutionsByParams] error:  ${error.message}`);
        return {};
    }
};

const EvolutionProvider = {
    insertEvolutionList,
    getEvolutionByParams,
    deleteEvolutionsList,
};

export default EvolutionProvider;

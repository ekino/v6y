import { evolutions } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';
import EvolutionHelpProvider from './EvolutionHelpProvider.js';

const insertEvolution = async (evolution) => {
    try {
        AppLogger.info(
            `[EvolutionProvider - insertEvolution] evolution title:  ${evolution?.title}`,
        );
        if (!evolution?.title?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - insertEvolution] error:  ${error.message}`);
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
        AppLogger.info(`[EvolutionProvider - insertEvolutionList] error:  ${error.message}`);
    }
};

const deleteEvolutionsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - deleteEvolutionsList] error:  ${error.message}`);
    }
};

const getEvolutionsByParams = async ({ appId }) => {
    try {
        const evolutionsByParams = evolutions;
        if (!evolutionsByParams?.length) {
            return;
        }

        const evolutionList = [];

        for (const evolution of evolutionsByParams) {
            if (appId && evolution?.module?.appId !== appId) {
                continue;
            }

            const evolutionHelp = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
                category: `${evolution.type}-${evolution.category}`,
            });

            evolutionList.push({
                ...evolution,
                evolutionHelp,
            });
        }

        return evolutionList;
    } catch (error) {
        AppLogger.info(`[EvolutionProvider - getEvolutionsByParams] error:  ${error.message}`);
        return [];
    }
};

const EvolutionProvider = {
    insertEvolutionList,
    getEvolutionsByParams,
    deleteEvolutionsList,
};

export default EvolutionProvider;

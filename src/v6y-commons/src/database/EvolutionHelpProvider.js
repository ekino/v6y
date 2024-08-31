import { evolutionHelps } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertEvolutionHelp = async (evolutionHelp) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpProvider - insertEvolutionHelp] error:  ${error.message}`);
        return {};
    }
};

const insertEvolutionHelpList = async (evolutionHelpList) => {
    try {
        if (!evolutionHelpList?.length) {
            return;
        }

        for (const evolutionHelp of evolutionHelpList) {
            await insertEvolutionHelp(evolutionHelp);
        }
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - insertEvolutionHelpList] error:  ${error.message}`,
        );
    }
};

const deleteEvolutionHelpList = async () => {
    try {
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - deleteEvolutionHelpList] error:  ${error.message}`,
        );
    }
};

const getEvolutionHelpDetailsByParams = async ({ category, evolutionHelpId }) => {
    try {
        AppLogger.info(
            `[EvolutionsProvider - getEvolutionHelpDetailsByParams] category: ${category}`,
        );

        if (category?.length) {
            return evolutionHelps.find((evolutionHelp) => evolutionHelp.category === category);
        }

        if (evolutionHelpId?.length) {
            return evolutionHelps.find((evolutionHelp) => evolutionHelp._id === evolutionHelpId);
        }

        return {};
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpDetailsByParams] error:  ${error.message}`,
        );
        return [];
    }
};

const getEvolutionHelpListByPageAndParams = async ({ start, limit, where, sort }) => {
    try {
        AppLogger.info(
            `[EvolutionsProvider - getEvolutionHelpListByPageAndParams] start: ${start}`,
        );
        AppLogger.info(
            `[EvolutionsProvider - getEvolutionHelpListByPageAndParams] limit: ${limit}`,
        );
        AppLogger.info(
            `[EvolutionsProvider - getEvolutionHelpListByPageAndParams] where: ${where}`,
        );
        AppLogger.info(`[EvolutionsProvider - getEvolutionHelpListByPageAndParams] sort: ${sort}`);

        return evolutionHelps;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpProvider - getEvolutionHelpListByPageAndParams] error:  ${error.message}`,
        );
        return [];
    }
};

const EvolutionHelpProvider = {
    insertEvolutionHelpList,
    deleteEvolutionHelpList,
    getEvolutionHelpDetailsByParams,
    getEvolutionHelpListByPageAndParams,
};

export default EvolutionHelpProvider;

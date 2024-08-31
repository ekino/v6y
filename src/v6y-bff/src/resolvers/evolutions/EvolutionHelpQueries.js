import { AppLogger, EvolutionHelpProvider } from '@v6y/commons';
import { evolutionHelpStatus } from '@v6y/commons/src/config/data/AppMockData.js';

const getEvolutionHelpListByPageAndParams = async (_, args) => {
    try {
        const { start, limit, where, sort } = args || {};

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] where : ${where}`,
        );
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] sort : ${sort}`,
        );

        const evolutionHelpList = await EvolutionHelpProvider.getEvolutionHelpListByPageAndParams({
            start,
            limit,
            where,
            sort,
        });

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] evolutionHelpList : ${evolutionHelpList?.length}`,
        );

        return evolutionHelpList;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

const getEvolutionHelpDetailsByParams = async (_, args) => {
    try {
        const { evolutionHelpId } = args || {};

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] evolutionHelpId : ${evolutionHelpId}`,
        );

        const appDetails = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            evolutionHelpId,
        });

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] error : ${error.message}`,
        );
        return {};
    }
};

const getEvolutionHelpStatus = async () => {
    try {
        return Object.keys(evolutionHelpStatus);
    } catch (error) {
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] error : ${error.message}`);
        return {};
    }
};

const EvolutionHelpQueries = {
    getEvolutionHelpListByPageAndParams,
    getEvolutionHelpDetailsByParams,
    getEvolutionHelpStatus,
};

export default EvolutionHelpQueries;

import { AppLogger, EvolutionHelpProvider, EvolutionHelpStatusType, EvolutionHelpType, SearchQueryType, evolutionHelpStatus } from '@v6y/commons';


/**
 * Get Evolution Help List By Page And Params
 * @param _
 * @param args
 */
const getEvolutionHelpListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
    try {
        const { start, limit, sort } = args || {};

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] sort : ${sort}`,
        );

        const evolutionHelpList = await EvolutionHelpProvider.getEvolutionHelpListByPageAndParams({
            start,
            limit,
            sort,
        });

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] evolutionHelpList : ${evolutionHelpList?.length}`,
        );

        return evolutionHelpList;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get Evolution Help Details By Params
 * @param _
 * @param args
 */
const getEvolutionHelpDetailsByParams = async (_: unknown, args: EvolutionHelpType) => {
    try {
        const { _id } = args || {};

        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] _id : ${_id}`);

        const evolutionDetails = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            _id,
        });

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] evolutionDetails : ${evolutionDetails?._id}`,
        );

        return evolutionDetails;
    } catch (error) {
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] error : ${error}`);
        return null;
    }
};

/**
 * Get Evolution Help Status
 * @param _
 * @param args
 */
const getEvolutionHelpStatus = async (
    _: unknown,
    args: SearchQueryType,
): Promise<EvolutionHelpStatusType[] | null> => {
    try {
        const { where, sort } = args || {}; // These arguments are not currently used in the function
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] where : ${where}`);
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] sort : ${sort}`);

        return Object.keys(evolutionHelpStatus)?.map((key) => ({
            label: key,
            value: evolutionHelpStatus[key],
        }));
    } catch (error) {
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] error : ${error}`);
        return null;
    }
};

const EvolutionHelpQueries = {
    getEvolutionHelpListByPageAndParams,
    getEvolutionHelpDetailsByParams,
    getEvolutionHelpStatus,
};

export default EvolutionHelpQueries;

import { AppLogger, EvolutionHelpProvider, evolutionHelpStatus } from '@v6y/commons';

/**
 * Retrieves a list of evolution help entries based on pagination and filtering parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including:
 *   - `start` (number): The starting index for pagination.
 *   - `limit` (number): The maximum number of evolution help entries to retrieve.
 *   - `sort` (object): An object defining the sorting criteria.
 * @returns An array of evolution help entries matching the criteria or an empty array on error
 */
const getEvolutionHelpListByPageAndParams = async (_, args) => {
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
            `[EvolutionHelpQueries - getEvolutionHelpListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of a specific evolution help entry by its ID.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing the query arguments, including `evolutionHelpId`.
 * @returns An object containing the evolution help details or an empty object on error
 */
const getEvolutionHelpDetailsByParams = async (_, args) => {
    try {
        const { evolutionHelpId } = args || {};

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] evolutionHelpId : ${evolutionHelpId}`,
        );

        const evolutionDetails = await EvolutionHelpProvider.getEvolutionHelpDetailsByParams({
            evolutionHelpId,
        });

        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] evolutionDetails : ${evolutionDetails?._id}`,
        );

        return evolutionDetails;
    } catch (error) {
        AppLogger.info(
            `[EvolutionHelpQueries - getEvolutionHelpDetailsByParams] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * Retrieves the evolution help statuses.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments (currently not used in the function).
 * @returns An array of objects representing the evolution help statuses, or an empty object on error.
 */
const getEvolutionHelpStatus = async (_, args) => {
    try {
        const { where, sort } = args || {}; // These arguments are not currently used in the function
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] where : ${where}`);
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] sort : ${sort}`);

        return Object.keys(evolutionHelpStatus)?.map((key) => ({
            label: key,
            value: evolutionHelpStatus[key],
        }));
    } catch (error) {
        AppLogger.info(`[EvolutionHelpQueries - getEvolutionHelpStatus] error : ${error.message}`);
        return null;
    }
};

/**
 * An object containing evolution help query functions
 */
const EvolutionHelpQueries = {
    getEvolutionHelpListByPageAndParams,
    getEvolutionHelpDetailsByParams,
    getEvolutionHelpStatus,
};

export default EvolutionHelpQueries;

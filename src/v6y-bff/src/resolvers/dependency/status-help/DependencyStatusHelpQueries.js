import { AppLogger, DependencyStatusHelpProvider } from '@v6y/commons';

/**
 * Retrieves a list of evolution help entries based on pagination and filtering parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including:
 *   - `start` (number): The starting index for pagination.
 *   - `limit` (number): The maximum number of evolution help entries to retrieve.
 *   - `where` (object): An object specifying filtering conditions.
 *   - `sort` (object): An object defining the sorting criteria.
 * @returns An array of evolution help entries matching the criteria or an empty array on error
 */
const getDependencyStatusHelpListByPageAndParams = async (_, args) => {
    try {
        const { start, limit, where, sort } = args || {};

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] where : ${where}`,
        );
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] sort : ${sort}`,
        );

        const dependencyStatusHelpList =
            await DependencyStatusHelpProvider.getDependencyStatusHelpListByPageAndParams({
                start,
                limit,
                where,
                sort,
            });

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] dependencyStatusHelpList : ${dependencyStatusHelpList?.length}`,
        );

        return dependencyStatusHelpList;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of a specific evolution help entry by its ID.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing the query arguments, including `dependencyStatusHelpId`.
 * @returns An object containing the evolution help details or an empty object on error
 */
const getDependencyStatusHelpDetailsByParams = async (_, args) => {
    try {
        const { dependencyStatusHelpId } = args || {};

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] dependencyStatusHelpId : ${dependencyStatusHelpId}`,
        );

        const dependencyStatusDetails =
            await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                dependencyStatusHelpId,
            });

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] dependencyStatusDetails : ${dependencyStatusDetails?._id}`,
        );

        return dependencyStatusDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * An object containing evolution help query functions
 */
const DependencyStatusHelpQueries = {
    getDependencyStatusHelpListByPageAndParams,
    getDependencyStatusHelpDetailsByParams,
};

export default DependencyStatusHelpQueries;

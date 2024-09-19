import { AppLogger, DeprecatedDependencyProvider } from '@v6y/commons';

/**
 * Retrieves a list of deprecated dependencies based on pagination and filtering parameters.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing query arguments, including:
 *   - `start` (number): The starting index for pagination.
 *   - `limit` (number): The maximum number of deprecated dependencies to retrieve.
 *   - `where` (object): An object specifying filtering conditions.
 *   - `sort` (object): An object defining the sorting criteria.
 * @returns An array of deprecated dependency entries matching the criteria or an empty array on error
 */
const getDeprecatedDependencyListByPageAndParams = async (_, args) => {
    try {
        const { start, limit, where, sort } = args || {};

        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] where : ${where}`,
        );
        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] sort : ${sort}`,
        );

        const deprecatedDependencyList =
            await DeprecatedDependencyProvider.getDeprecatedDependencyListByPageAndParams({
                start,
                limit,
                sort,
            });

        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] deprecatedDependencyList : ${deprecatedDependencyList?.length}`,
        );

        return deprecatedDependencyList;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] error : ${error.message}`,
        );
        return [];
    }
};

/**
 * Retrieves the details of a specific deprecated dependency by its ID.
 *
 * @param _ - Placeholder parameter (not used).
 * @param args - An object containing the query arguments, including 'deprecatedDependencyId'.
 * @returns An object containing the deprecated dependency details or an empty object if not found or on error.
 */
const getDeprecatedDependencyDetailsByParams = async (_, args) => {
    try {
        const { deprecatedDependencyId } = args || {};

        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyDetailsByParams] deprecatedDependencyId : ${deprecatedDependencyId}`,
        );

        const deprecatedDependencyDetails =
            await DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams({
                deprecatedDependencyId,
            });

        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyDetailsByParams] deprecatedDependencyDetails : ${deprecatedDependencyDetails?._id}`,
        );

        return deprecatedDependencyDetails;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyDetailsByParams] error : ${error.message}`,
        );
        return null;
    }
};

/**
 * An object containing deprecated dependency query functions.
 */
const DeprecatedDependencyQueries = {
    getDeprecatedDependencyListByPageAndParams,
    getDeprecatedDependencyDetailsByParams,
};

export default DeprecatedDependencyQueries;

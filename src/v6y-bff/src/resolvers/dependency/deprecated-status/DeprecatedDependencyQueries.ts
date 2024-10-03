import {
    AppLogger,
    DeprecatedDependencyProvider,
    DeprecatedDependencyType,
    SearchQueryType,
} from '@v6y/commons';

/**
 * Get deprecated dependency list by page and params
 * @param _
 * @param args
 */
const getDeprecatedDependencyListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
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
            `[DeprecatedDependencyQueries - getDeprecatedDependencyListByPageAndParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get deprecated dependency details by params
 * @param _
 * @param args
 */
const getDeprecatedDependencyDetailsByParams = async (
    _: unknown,
    args: DeprecatedDependencyType,
) => {
    try {
        const { _id } = args || {};

        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyDetailsByParams] _id : ${_id}`,
        );

        const deprecatedDependencyDetails =
            await DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams({
                _id,
            });

        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyDetailsByParams] deprecatedDependencyDetails : ${deprecatedDependencyDetails?._id}`,
        );

        return deprecatedDependencyDetails;
    } catch (error) {
        AppLogger.info(
            `[DeprecatedDependencyQueries - getDeprecatedDependencyDetailsByParams] error : ${error}`,
        );
        return null;
    }
};

const DeprecatedDependencyQueries = {
    getDeprecatedDependencyListByPageAndParams,
    getDeprecatedDependencyDetailsByParams,
};

export default DeprecatedDependencyQueries;

import {
    AppLogger,
    DependencyStatusHelpProvider,
    DependencyStatusHelpType,
    SearchQueryType,
} from '@v6y/commons';

/**
 * Get Dependency Status Help List By Page And Params
 * @param _
 * @param args
 */
const getDependencyStatusHelpListByPageAndParams = async (_: unknown, args: SearchQueryType) => {
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
            `[DependencyStatusHelpQueries - getDependencyStatusHelpListByPageAndParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get Dependency Status Help Details By Params
 * @param _
 * @param args
 */
const getDependencyStatusHelpDetailsByParams = async (
    _: unknown,
    args: DependencyStatusHelpType,
) => {
    try {
        const { _id } = args || {};

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] _id : ${_id}`,
        );

        const dependencyStatusDetails =
            await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                _id,
            });

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] dependencyStatusDetails : ${dependencyStatusDetails?._id}`,
        );

        return dependencyStatusDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] error : ${error}`,
        );
        return null;
    }
};

const DependencyStatusHelpQueries = {
    getDependencyStatusHelpListByPageAndParams,
    getDependencyStatusHelpDetailsByParams,
};

export default DependencyStatusHelpQueries;

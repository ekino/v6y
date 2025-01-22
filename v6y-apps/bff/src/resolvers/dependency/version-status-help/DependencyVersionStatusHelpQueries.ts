import {
    AppLogger,
    DependencyVersionStatusHelpProvider,
    DependencyVersionStatusHelpType,
    SearchQueryType,
} from '@v6y/core-logic';

/**
 * Get Dependency Version Status Help List By Page And Params
 * @param _
 * @param args
 */
const getDependencyVersionStatusHelpListByPageAndParams = async (
    _: unknown,
    args: SearchQueryType,
) => {
    try {
        const { start, limit, where, sort } = args || {};

        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpListByPageAndParams] start : ${start}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpListByPageAndParams] limit : ${limit}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpListByPageAndParams] where : ${where}`,
        );
        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpListByPageAndParams] sort : ${sort}`,
        );

        const dependencyVersionStatusHelpList =
            await DependencyVersionStatusHelpProvider.getDependencyVersionStatusHelpListByPageAndParams(
                {
                    start,
                    limit,
                    where,
                    sort,
                },
            );

        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpListByPageAndParams] dependencyVersionStatusHelpList : ${dependencyVersionStatusHelpList?.length}`,
        );

        return dependencyVersionStatusHelpList;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpListByPageAndParams] error : ${error}`,
        );
        return [];
    }
};

/**
 * Get Dependency Version Status Help Details By Params
 * @param _
 * @param args
 */
const getDependencyVersionStatusHelpDetailsByParams = async (
    _: unknown,
    args: DependencyVersionStatusHelpType,
) => {
    try {
        const { _id } = args || {};

        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpDetailsByParams] _id : ${_id}`,
        );

        const dependencyVersionStatusDetails =
            await DependencyVersionStatusHelpProvider.getDependencyVersionStatusHelpDetailsByParams(
                {
                    _id,
                },
            );

        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpDetailsByParams] dependencyVersionStatusDetails : ${dependencyVersionStatusDetails?._id}`,
        );

        return dependencyVersionStatusDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusHelpQueries - getDependencyVersionStatusHelpDetailsByParams] error : ${error}`,
        );
        return null;
    }
};

const DependencyVersionStatusHelpQueries = {
    getDependencyVersionStatusHelpListByPageAndParams,
    getDependencyVersionStatusHelpDetailsByParams,
};

export default DependencyVersionStatusHelpQueries;

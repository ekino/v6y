import { AppLogger, DeprecatedDependencyProvider } from '@v6y/commons';

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
            await DeprecatedDependencyProvider.getDeprecatedDependencyListByPageAndParams();

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
        return {};
    }
};

const DeprecatedDependencyQueries = {
    getDeprecatedDependencyListByPageAndParams,
    getDeprecatedDependencyDetailsByParams,
};

export default DeprecatedDependencyQueries;

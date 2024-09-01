import { AppLogger, DependencyStatusHelpProvider } from '@v6y/commons';

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

const getDependencyStatusHelpDetailsByParams = async (_, args) => {
    try {
        const { dependencyStatusHelpId } = args || {};

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] dependencyStatusHelpId : ${dependencyStatusHelpId}`,
        );

        const appDetails =
            await DependencyStatusHelpProvider.getDependencyStatusHelpDetailsByParams({
                dependencyStatusHelpId,
            });

        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] appDetails : ${appDetails?._id}`,
        );

        return appDetails;
    } catch (error) {
        AppLogger.info(
            `[DependencyStatusHelpQueries - getDependencyStatusHelpDetailsByParams] error : ${error.message}`,
        );
        return {};
    }
};

const DependencyStatusHelpQueries = {
    getDependencyStatusHelpListByPageAndParams,
    getDependencyStatusHelpDetailsByParams,
};

export default DependencyStatusHelpQueries;

import { AppLogger, AppProvider } from '@v6y/commons';

const getAppDetailsInfosByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getAppDetailsInfosByParams] appId : ${appId}`);

        const appDetails = await AppProvider.getAppDetailsInfosByParams({
            appId,
        });

        AppLogger.info(`[AppQueries - getAppDetailsInfosByParams] appDetails : ${appDetails?._id}`);

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppDetailsInfosByParams] error : ${error.message}`);
        return {};
    }
};

const getAppDetailsAuditReportsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getAppDetailsAuditReports] appId : ${appId}`);

        const auditsReports = await AppProvider.getAppDetailsAuditReportsByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getAppDetailsAuditReports] auditsReports : ${auditsReports?.length}`,
        );

        return auditsReports;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppDetailsAuditReports] error : ${error.message}`);
        return [];
    }
};

const getAppDetailsEvolutionsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getAppDetailsEvolutionsByParams] appId : ${appId}`);

        const evolutions = await AppProvider.getAppDetailsEvolutionsByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getAppDetailsEvolutionsByParams] evolutions : ${evolutions?.length}`,
        );

        return evolutions;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppDetailsEvolutionsByParams] error : ${error.message}`);
        return [];
    }
};

const getAppDetailsDependenciesByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getAppDetailsDependenciesByParams] appId : ${appId}`);

        const dependencies = await AppProvider.getAppDetailsDependenciesByParams({
            appId,
        });

        AppLogger.info(
            `[AppQueries - getAppDetailsDependenciesByParams] dependencies : ${dependencies?.length}`,
        );

        return dependencies;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppDetailsDependenciesByParams] error : ${error.message}`);
        return [];
    }
};

const getAppListByPageAndParams = async (_, args) => {
    try {
        const { start, offset, limit, keywords, searchText, where, sort } = args || {};

        AppLogger.info(`[AppQueries - getAppListByPageAndParams] start : ${start}`);
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] offset : ${offset}`);
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[AppQueries - getAppListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] searchText : ${searchText}`);
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] where : ${where}`);
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] sort : ${sort}`);

        const appList = await AppProvider.getAppsByParams({
            searchText,
            keywords,
            offset: offset || start,
            limit,
            where,
        });

        AppLogger.info(`[AppQueries - getAppListByPageAndParams] appList : ${appList?.length}`);

        return appList;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] error : ${error.message}`);
        return [];
    }
};

const getAppsStatsByParams = async (_, args) => {
    try {
        const { keywords } = args || {};

        AppLogger.info(
            `[AppQueries - getAppsStatsByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );

        const appsStats = await AppProvider.getAppsStatsByParams({
            keywords,
        });

        AppLogger.info(
            `[AppQueries - getAppsStatsByParams] appsStats : ${appsStats?.data?.length}`,
        );

        return appsStats;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppsStatsByParams] error : ${error.message}`);
        return {};
    }
};

const getAppsTotalByParams = async (_, args) => {
    try {
        const { keywords, searchText } = args || {};

        AppLogger.info(
            `[AppQueries - getAppsTotalByParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(`[AppQueries - getAppsTotalByParams] searchText : ${searchText}`);

        const appsTotal = await AppProvider.getAppsTotalByParams({
            searchText,
            keywords,
        });

        AppLogger.info(`[AppQueries - getAppsTotalByParams] apps Total : ${appsTotal}`);

        return appsTotal;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppsTotalByParams] error : ${error.message}`);
        return 0;
    }
};

const AppQueries = {
    getAppDetailsInfosByParams,
    getAppDetailsAuditReportsByParams,
    getAppDetailsEvolutionsByParams,
    getAppDetailsDependenciesByParams,
    getAppsTotalByParams,
    getAppListByPageAndParams,
    getAppsStatsByParams,
};

export default AppQueries;

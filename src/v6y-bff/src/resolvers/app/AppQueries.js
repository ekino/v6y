import { AppLogger, AppProvider } from '@v6y/commons';

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

const getAppDetailsByParams = async (_, args) => {
    try {
        const { appId } = args || {};

        AppLogger.info(`[AppQueries - getAppDetailsByParams] appId : ${appId}`);

        const appDetails = await AppProvider.getAppDetailsByParams({
            appId,
        });

        AppLogger.info(`[AppQueries - getAppDetailsByParams] appDetails : ${appDetails?._id}`);

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AppQueries - getAppDetailsByParams] error : ${error.message}`);
        return {};
    }
};

const getAppListByPageAndParams = async (_, args) => {
    try {
        const { offset, limit, keywords, searchText } = args || {};

        AppLogger.info(`[AppQueries - getAppListByPageAndParams] offset : ${offset}`);
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] limit : ${limit}`);
        AppLogger.info(
            `[AppQueries - getAppListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`,
        );
        AppLogger.info(`[AppQueries - getAppListByPageAndParams] searchText : ${searchText}`);

        const appList = await AppProvider.getAppsByParams({
            searchText,
            keywords,
            offset,
            limit,
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
    getAppDetailsByParams,
    getAppDetailsAuditReportsByParams,
    getAppsTotalByParams,
    getAppListByPageAndParams,
    getAppsStatsByParams,
};

export default AppQueries;

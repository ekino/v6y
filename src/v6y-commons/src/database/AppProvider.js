import { appList, auditsReports } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertApp = async (app) => {
    try {
        return null;
    } catch (error) {
        AppLogger.info(`[AppProvider - insertApp] error: ${error.message}`);
        return null;
    }
};

const deleteAppList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[AppProvider - deleteAppList] error:  ${error.message}`);
    }
};

const getAppDetailsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getAppDetailsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        const appDetails = appList?.find((app) => app._id === appId);

        AppLogger.info(`[AppProvider - getAppDetailsByParams] appDetails: ${appDetails?._id}`);

        return appDetails;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppDetailsByParams] error: ${error.message}`);
        return {};
    }
};

const getAppDetailsAuditReportsByParams = async ({ appId }) => {
    try {
        AppLogger.info(`[AppProvider - getAppDetailsAuditReportsByParams] appId: ${appId}`);

        if (!appId?.length) {
            return null;
        }

        return auditsReports;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppDetailsAuditReportsByParams] error: ${error.message}`);
        return {};
    }
};

const getAppsByParams = async ({ keywords, searchText, offset = 0, limit }) => {
    try {
        AppLogger.info(`[AppProvider - getAppsByParams] keywords: ${keywords?.join('\r\n')}`);
        AppLogger.info(`[AppProvider - getAppsByParams] searchText: ${searchText}`);
        AppLogger.info(`[AppProvider - getAppsByParams] offset: ${offset}`);
        AppLogger.info(`[AppProvider - getAppsByParams] limit: ${limit}`);

        // read from DB

        return limit ? appList.slice(offset, offset + limit) : appList;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppsByParams] error: ${error.message}`);
        return [];
    }
};

const getAppsTotalByParams = async ({ searchText, keywords }) => {
    try {
        AppLogger.info(`[AppProvider - getAppsTotalByParams] searchText: ${searchText}`);
        AppLogger.info(`[AppProvider - getAppsTotalByParams] keywords: ${keywords?.join('\r\n')}`);

        const apps = await getAppsByParams({ keywords, searchText });

        AppLogger.info(`[AppProvider - getAppsTotalByParams] apps total: ${apps?.length}`);

        return apps?.length;
    } catch (error) {
        AppLogger.info(`[AppProvider - getAppsTotalByParams] error: ${error.message}`);
        return 0;
    }
};

const AppProvider = {
    insertApp,
    getAppDetailsByParams,
    getAppDetailsAuditReportsByParams,
    getAppsByParams,
    getAppsTotalByParams,
    deleteAppList,
};

export default AppProvider;

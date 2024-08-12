import { AppLogger, AppProvider, KeywordsProvider } from '@v6y/commons';

const { getKeywordsByParams } = KeywordsProvider;

const { getAppsByParams, getAppsCountByParams } = AppProvider;

const getAppListByPageAndParams = async (_, args) => {
    try {
        const { offset, limit, keywords, searchText } = args || {};

        AppLogger.info(`[getAppListByPageAndParams] offset : ${offset}`);
        AppLogger.info(`[getAppListByPageAndParams] limit : ${limit}`);
        AppLogger.info(`[getAppListByPageAndParams] keywords : ${keywords?.join?.(',') || ''}`);
        AppLogger.info(`[getAppListByPageAndParams] searchText : ${searchText}`);

        const appList = await getAppsByParams({
            searchText,
            keywords,
            offset,
            limit,
        });

        AppLogger.info(`[getAppListByPageAndParams] appList : ${appList?.length}`);

        return appList;
    } catch (error) {
        AppLogger.info(`[getAppListByPageAndParams] error : ${error.message}`);
        return [];
    }
};

const getAppKeywords = async () => {
    try {
        const appKeywordsList = await getKeywordsByParams();

        AppLogger.info(`[getAppKeywords] appKeywordsList : ${appKeywordsList?.length}`);

        return appKeywordsList;
    } catch (error) {
        AppLogger.info(`[getAppKeywords] error : ${error.message}`);
        return [];
    }
};

const getAppTotalNumber = async (_, args) => {
    try {
        const { keywords, searchText } = args || {};

        AppLogger.info(`[getAppTotalNumber] keywords : ${keywords?.join?.(',') || ''}`);
        AppLogger.info(`[getAppTotalNumber] searchText : ${searchText}`);

        const appListCount = await getAppsCountByParams({
            searchText,
            keywords,
        });

        AppLogger.info(`[getAppTotalNumber] appListCount : ${appListCount}`);

        return appListCount;
    } catch (error) {
        AppLogger.info(`[getAppTotalNumber] error : ${error.message}`);
        return 0;
    }
};

const AppQueries = {
    getAppTotalNumber,
    getAppListByPageAndParams,
    getAppKeywords,
};

export default AppQueries;

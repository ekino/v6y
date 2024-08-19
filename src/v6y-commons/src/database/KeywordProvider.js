import { keywords } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertKeyword = async (keyword) => {
    try {
        AppLogger.info(`[insertKeyword] keyword label:  ${keyword?.label}`);
        if (!keyword?.label?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[insertKeyword] error:  ${error.message}`);
        return {};
    }
};

const insertKeywordList = async (keywordList) => {
    try {
        if (!keywordList?.length) {
            return;
        }

        for (const keyword of keywordList) {
            await insertKeyword(keyword);
        }
    } catch (error) {
        AppLogger.info(`[insertKeywordList] error:  ${error.message}`);
    }
};

const deleteKeywordsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[deleteKeywordsList] error:  ${error.message}`);
    }
};

const getKeywordsByParams = async ({ appId = null }) => {
    try {
        AppLogger.info(`[getKeywordsByParams] appId:  ${appId}`);

        // read from DB

        return appId?.length > 0
            ? keywords.filter((keyword) => keyword?.apps?.find((app) => app.appId === appId))
            : keywords;
    } catch (error) {
        AppLogger.info(`[getKeywordsByParams] error:  ${error.message}`);
        return [];
    }
};

const KeywordProvider = {
    insertKeywordList,
    getKeywordsByParams,
    deleteKeywordsList,
};

export default KeywordProvider;

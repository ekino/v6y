import { keywords, keywordsStats } from '../config/data/AppMockData.js';
import AppLogger from '../core/AppLogger.js';

const insertKeyword = async (keyword) => {
    try {
        AppLogger.info(`[KeywordProvider - insertKeyword] keyword label:  ${keyword?.label}`);
        if (!keyword?.label?.length) {
            return {};
        }

        return null;
    } catch (error) {
        AppLogger.info(`[KeywordProvider - insertKeyword] error:  ${error.message}`);
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
        AppLogger.info(`[KeywordProvider - insertKeywordList] error:  ${error.message}`);
    }
};

const deleteKeywordsList = async () => {
    try {
    } catch (error) {
        AppLogger.info(`[KeywordProvider - deleteKeywordsList] error:  ${error.message}`);
    }
};

const getKeywordListByParams = async ({ appId = null }) => {
    try {
        AppLogger.info(`[KeywordProvider - getKeywordListByParams] appId:  ${appId}`);

        // read from DB

        return appId?.length > 0
            ? keywords.filter((keyword) => keyword?.module?.appId === appId)
            : keywords;
    } catch (error) {
        AppLogger.info(`[KeywordProvider - getKeywordListByParams] error:  ${error.message}`);
        return [];
    }
};

const getKeywordsStatsByParams = async ({ keywords }) => {
    try {
        AppLogger.info(
            `[KeywordProvider - getKeywordsStatsByParams] keywords: ${keywords?.join('\r\n')}`,
        );

        // read from DB

        return keywordsStats;
    } catch (error) {
        AppLogger.info(`[KeywordProvider - getKeywordsStatsByParams] error:  ${error.message}`);
        return [];
    }
};

const KeywordProvider = {
    insertKeywordList,
    deleteKeywordsList,
    getKeywordListByParams,
    getKeywordsStatsByParams,
};

export default KeywordProvider;

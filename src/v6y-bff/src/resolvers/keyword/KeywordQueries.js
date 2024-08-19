import { AppLogger, KeywordProvider } from '@v6y/commons';

const getKeywordsByParams = async () => {
    try {
        const keywordsList = await KeywordProvider.getKeywordsByParams();

        AppLogger.info(`[AppQueries - getKeywordsByParams] keywordsList : ${keywordsList?.length}`);

        return keywordsList;
    } catch (error) {
        AppLogger.info(`[AppQueries - getKeywordsByParams] error : ${error.message}`);
        return [];
    }
};

const KeywordQueries = {
    getKeywordsByParams,
};

export default KeywordQueries;

import { AppLogger, KeywordProvider } from '@v6y/commons';

const getKeywordListByParams = async () => {
    try {
        const keywordsList = await KeywordProvider.getKeywordListByParams({});

        AppLogger.info(
            `[AppQueries - getKeywordListByParams] keywordsList : ${keywordsList?.length}`,
        );

        return keywordsList;
    } catch (error) {
        AppLogger.info(`[AppQueries - getKeywordListByParams] error : ${error.message}`);
        return [];
    }
};

const KeywordQueries = {
    getKeywordListByParams,
};

export default KeywordQueries;

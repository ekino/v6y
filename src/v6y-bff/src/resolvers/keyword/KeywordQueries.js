import { AppLogger, KeywordProvider } from '@v6y/commons';

/**
 * Retrieves a list of keywords.
 *
 * @returns An array of keywords or an empty array on error.
 */
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

/**
 * An object containing keyword query functions.
 */
const KeywordQueries = {
    getKeywordListByParams,
};

export default KeywordQueries;

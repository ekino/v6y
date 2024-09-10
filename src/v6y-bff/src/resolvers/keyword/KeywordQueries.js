import { AppLogger, KeywordProvider } from '@v6y/commons';

/**
 * Retrieves a list of keywords.
 *
 * @returns An array of keywords or an empty array on error.
 */
const getKeywordListByPageAndParams = async () => {
    try {
        const keywordsList = await KeywordProvider.getKeywordListByPageAndParams({});

        AppLogger.info(
            `[AppQueries - getKeywordListByPageAndParams] keywordsList : ${keywordsList?.length}`,
        );

        return keywordsList;
    } catch (error) {
        AppLogger.info(`[AppQueries - getKeywordListByPageAndParams] error : ${error.message}`);
        return [];
    }
};

/**
 * An object containing keyword query functions.
 */
const KeywordQueries = {
    getKeywordListByPageAndParams,
};

export default KeywordQueries;

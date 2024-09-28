import AppLogger from '../core/AppLogger.ts';
import { KeywordModelType } from './models/KeywordModel.ts';
/**
 * Create Keyword
 * @param keyword
 */
const createKeyword = async (keyword) => {
    try {
        AppLogger.info(`[KeywordProvider - createKeyword] keyword label:  ${keyword?.label}`);
        if (!keyword?.label?.length) {
            return null;
        }
        const createdKeyword = await KeywordModelType.create({
            ...keyword,
            appId: keyword.module?.appId,
        });
        AppLogger.info(`[KeywordProvider - createKeyword] createdKeyword: ${createdKeyword?._id}`);
        return createdKeyword;
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - createKeyword] error:  ${error}`);
        return null;
    }
};
/**
 * Insert Keyword List
 * @param keywordList
 */
const insertKeywordList = async (keywordList) => {
    try {
        AppLogger.info(`[KeywordProvider - insertKeywordList] keywordList:  ${keywordList?.length}`);
        if (!keywordList?.length) {
            return null;
        }
        for (const keyword of keywordList) {
            await createKeyword(keyword);
        }
        AppLogger.info(`[KeywordProvider - insertKeywordList] keywordList list inserted successfully`);
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - insertKeywordList] error:  ${error}`);
    }
};
/**
 * Edit existing Keyword
 * @param keyword
 */
const editKeyword = async (keyword) => {
    try {
        AppLogger.info(`[KeywordProvider - createKeyword] keyword _id:  ${keyword?._id}`);
        AppLogger.info(`[KeywordProvider - createKeyword] keyword label:  ${keyword?.label}`);
        if (!keyword?._id || !keyword?.label?.length) {
            return null;
        }
        const editedKeyword = await KeywordModelType.update(keyword, {
            where: {
                _id: keyword?._id,
            },
        });
        AppLogger.info(`[KeywordProvider - editKeyword] editedKeyword: ${editedKeyword?.[0]}`);
        return {
            _id: keyword?._id,
        };
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - editKeyword] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Keyword
 * @param _id
 */
const deleteKeyword = async ({ _id }) => {
    try {
        AppLogger.info(`[KeywordProvider - deleteKeyword] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await KeywordModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - deleteKeyword] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Keyword List
 */
const deleteKeywordList = async () => {
    try {
        await KeywordModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - deleteKeywordList] error:  ${error}`);
        return false;
    }
};
/**
 * Get Keyword List By Parameters
 * @param appId
 */
const getKeywordListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger.info(`[KeywordProvider - getKeywordListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const keywordList = await KeywordModelType.findAll(queryOptions);
        AppLogger.info(`[KeywordProvider - getKeywordListByPageAndParams] keywordList: ${keywordList?.length}`);
        return keywordList;
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - getKeywordListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Get Keywords Stats
 * @param keywords
 */
const getKeywordsStatsByParams = async ({ keywords, }) => {
    try {
        AppLogger.info(`[KeywordProvider - getKeywordsStatsByParams] keywords: ${keywords?.join('\r\n')}`);
        if (!keywords?.length) {
            return null;
        }
        // based on keywords and dependencies
        // count total from modules
        return null;
    }
    catch (error) {
        AppLogger.info(`[KeywordProvider - getKeywordsStatsByParams] error:  ${error}`);
        return null;
    }
};
const KeywordProvider = {
    createKeyword,
    insertKeywordList,
    editKeyword,
    deleteKeyword,
    deleteKeywordList,
    getKeywordsStatsByParams,
    getKeywordListByPageAndParams,
};
export default KeywordProvider;

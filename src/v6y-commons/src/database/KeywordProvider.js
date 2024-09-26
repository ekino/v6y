"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const KeywordModel_1 = require("./models/KeywordModel");
/**
 * Create Keyword
 * @param keyword
 */
const createKeyword = async (keyword) => {
    try {
        AppLogger_1.default.info(`[KeywordProvider - createKeyword] keyword label:  ${keyword?.label}`);
        if (!keyword?.label?.length) {
            return null;
        }
        const createdKeyword = await KeywordModel_1.KeywordModelType.create({
            ...keyword,
            appId: keyword.module?.appId,
        });
        AppLogger_1.default.info(`[KeywordProvider - createKeyword] createdKeyword: ${createdKeyword?._id}`);
        return createdKeyword;
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - createKeyword] error:  ${error}`);
        return null;
    }
};
/**
 * Insert Keyword List
 * @param keywordList
 */
const insertKeywordList = async (keywordList) => {
    try {
        AppLogger_1.default.info(`[KeywordProvider - insertKeywordList] keywordList:  ${keywordList?.length}`);
        if (!keywordList?.length) {
            return null;
        }
        for (const keyword of keywordList) {
            await createKeyword(keyword);
        }
        AppLogger_1.default.info(`[KeywordProvider - insertKeywordList] keywordList list inserted successfully`);
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - insertKeywordList] error:  ${error}`);
    }
};
/**
 * Edit existing Keyword
 * @param keyword
 */
const editKeyword = async (keyword) => {
    try {
        AppLogger_1.default.info(`[KeywordProvider - createKeyword] keyword _id:  ${keyword?._id}`);
        AppLogger_1.default.info(`[KeywordProvider - createKeyword] keyword label:  ${keyword?.label}`);
        if (!keyword?._id || !keyword?.label?.length) {
            return null;
        }
        const editedKeyword = await KeywordModel_1.KeywordModelType.update(keyword, {
            where: {
                _id: keyword?._id,
            },
        });
        AppLogger_1.default.info(`[KeywordProvider - editKeyword] editedKeyword: ${editedKeyword?.[0]}`);
        return {
            _id: keyword?._id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - editKeyword] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Keyword
 * @param _id
 */
const deleteKeyword = async ({ _id }) => {
    try {
        AppLogger_1.default.info(`[KeywordProvider - deleteKeyword] _id:  ${_id}`);
        if (!_id) {
            return null;
        }
        await KeywordModel_1.KeywordModelType.destroy({
            where: {
                _id,
            },
        });
        return {
            _id,
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - deleteKeyword] error:  ${error}`);
        return null;
    }
};
/**
 * Delete Keyword List
 */
const deleteKeywordList = async () => {
    try {
        await KeywordModel_1.KeywordModelType.destroy({
            truncate: true,
        });
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - deleteKeywordList] error:  ${error}`);
        return false;
    }
};
/**
 * Get Keyword List By Parameters
 * @param appId
 */
const getKeywordListByPageAndParams = async ({ appId }) => {
    try {
        AppLogger_1.default.info(`[KeywordProvider - getKeywordListByPageAndParams] appId: ${appId}`);
        const queryOptions = {};
        if (appId) {
            queryOptions.where = {
                appId,
            };
        }
        const keywordList = await KeywordModel_1.KeywordModelType.findAll(queryOptions);
        AppLogger_1.default.info(`[KeywordProvider - getKeywordListByPageAndParams] keywordList: ${keywordList?.length}`);
        return keywordList;
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - getKeywordListByPageAndParams] error:  ${error}`);
        return [];
    }
};
/**
 * Get Keywords Stats
 * @param keywords
 */
const getKeywordsStatsByParams = async ({ keywords, }) => {
    try {
        AppLogger_1.default.info(`[KeywordProvider - getKeywordsStatsByParams] keywords: ${keywords?.join('\r\n')}`);
        if (!keywords?.length) {
            return null;
        }
        // based on keywords and dependencies
        // count total from modules
        return null;
    }
    catch (error) {
        AppLogger_1.default.info(`[KeywordProvider - getKeywordsStatsByParams] error:  ${error}`);
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
exports.default = KeywordProvider;

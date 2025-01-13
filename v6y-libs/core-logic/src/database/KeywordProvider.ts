import { FindOptions, Op } from 'sequelize';

import AppLogger from '../core/AppLogger.ts';
import { KeywordStatsType, KeywordType } from '../types/KeywordType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { KeywordModelType } from './models/KeywordModel.ts';

/**
 * Format Keywords
 * @param keywords
 */
const formatKeywords = (keywords: string[] | string) =>
    Array.isArray(keywords) ? keywords?.[0]?.split(',') : (keywords as string).split(',');

/**
 * Create Keyword
 * @param keyword
 */
const createKeyword = async (keyword: KeywordType) => {
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
    } catch (error) {
        AppLogger.info(`[KeywordProvider - createKeyword] error:  ${error}`);
        return null;
    }
};

/**
 * Insert Keyword List
 * @param keywordList
 */
const insertKeywordList = async (keywordList: KeywordType[]) => {
    try {
        AppLogger.info(
            `[KeywordProvider - insertKeywordList] keywordList:  ${keywordList?.length}`,
        );
        if (!keywordList?.length) {
            return null;
        }

        for (const keyword of keywordList) {
            await createKeyword(keyword);
        }

        AppLogger.info(
            `[KeywordProvider - insertKeywordList] keywordList list inserted successfully`,
        );
    } catch (error) {
        AppLogger.info(`[KeywordProvider - insertKeywordList] error:  ${error}`);
    }
};

/**
 * Edit existing Keyword
 * @param keyword
 */
const editKeyword = async (keyword: KeywordType) => {
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
    } catch (error) {
        AppLogger.info(`[KeywordProvider - editKeyword] error:  ${error}`);
        return null;
    }
};

/**
 * Delete Keyword
 * @param _id
 */
const deleteKeyword = async ({ _id }: KeywordType) => {
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
    } catch (error) {
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
    } catch (error) {
        AppLogger.info(`[KeywordProvider - deleteKeywordList] error:  ${error}`);
        return false;
    }
};

/**
 * Get Applications Ids By Keywords
 * @param keywords
 */
const getApplicationsIdsByKeywords = async ({
    keywords,
}: SearchQueryType): Promise<number[] | null | undefined> => {
    try {
        AppLogger.info(`[KeywordProvider - getApplicationsIdsByKeywords] keywords: ${keywords}`);

        if (!keywords?.length) {
            return null;
        }

        // based on keywords and dependencies
        // keywords: Code-Security-commons-window,Code-Coupling-circular-dependencies
        const keywordList = await KeywordModelType.findAll({
            where: {
                label: {
                    [Op.in]: formatKeywords(keywords),
                },
            },
        });

        AppLogger.info(
            `[KeywordProvider - getKeywordsStatsByParams] keywordList: ${keywordList?.length}`,
        );

        if (!keywordList?.length) {
            return null;
        }

        const uniqueAppIds = new Set<number>(
            keywordList
                .map((item) => item.dataValues)
                .map((item) => item.appId || -1)
                .filter((item) => item !== -1),
        );

        AppLogger.info(
            `[KeywordProvider - getKeywordsStatsByParams] keywordList: ${uniqueAppIds?.size}`,
        );

        if (!uniqueAppIds?.size) {
            return null;
        }

        return [...uniqueAppIds];
    } catch (error) {
        AppLogger.info(`[KeywordProvider - getKeywordListByPageAndParams] error:  ${error}`);
        return null;
    }
};

/**
 * Get Keyword List By Parameters
 * @param appId
 */
const getKeywordListByPageAndParams = async ({ appId }: KeywordType) => {
    try {
        AppLogger.info(`[KeywordProvider - getKeywordListByPageAndParams] appId: ${appId}`);

        const queryOptions: FindOptions = {};

        if (appId) {
            queryOptions.where = {
                appId,
            };
        }

        const keywordList = await KeywordModelType.findAll(queryOptions);

        AppLogger.info(
            `[KeywordProvider - getKeywordListByPageAndParams] keywordList: ${keywordList?.length}`,
        );

        return keywordList?.map((item) => item?.dataValues) || [];
    } catch (error) {
        AppLogger.info(`[KeywordProvider - getKeywordListByPageAndParams] error:  ${error}`);
        return [];
    }
};

/**
 * Get Keywords Stats
 * @param keywords
 */
const getKeywordsStatsByParams = async ({
    keywords,
}: SearchQueryType): Promise<KeywordStatsType[] | null> => {
    try {
        AppLogger.info(`[KeywordProvider - getKeywordsStatsByParams] keywords: ${keywords}`);

        if (!keywords?.length) {
            return null;
        }

        // based on keywords and dependencies
        // keywords: Code-Security-commons-window,Code-Coupling-circular-dependencies
        const keywordList = await KeywordModelType.findAll({
            where: {
                label: {
                    [Op.in]: formatKeywords(keywords),
                },
            },
        });

        AppLogger.info(
            `[KeywordProvider - getKeywordsStatsByParams] keywordList: ${keywordList?.length}`,
        );

        if (!keywordList?.length) {
            return null;
        }

        // count total from modules
        const keywordValues = keywordList?.map((item) => item?.dataValues) || [];
        AppLogger.info(
            `[KeywordProvider - getKeywordsStatsByParams] keywordValues: ${keywordValues?.length}`,
        );

        if (!keywordValues?.length) {
            return null;
        }

        const keywordStatsMap = new Map<string, number>();
        const visitedAppIds = new Set<string>();

        for (const keywordValue of keywordValues) {
            const { appId, label } = keywordValue;
            if (!label?.length) {
                continue;
            }
            if (!appId) {
                continue;
            }
            if (visitedAppIds.has(`${label}-${appId}`)) {
                continue;
            }

            visitedAppIds.add(`${label}-${appId}`);

            const oldTotal = keywordStatsMap.get(label) || 0;
            keywordStatsMap.set(label, oldTotal + 1);
        }

        AppLogger.info(
            `[KeywordProvider - getKeywordsStatsByParams] keywordStatsMap: ${keywordStatsMap?.size}`,
        );

        return Array.from(keywordStatsMap).map(([label, total]) => ({
            keyword: {
                label,
            },
            total,
        }));
    } catch (error) {
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
    getApplicationsIdsByKeywords,
};

export default KeywordProvider;

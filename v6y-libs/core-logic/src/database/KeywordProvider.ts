import { Prisma } from '@prisma/client';

import AppLogger from '../core/AppLogger.ts';
import { KeywordStatsType, KeywordType } from '../types/KeywordType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { getPrismaClient } from './PrismaClient.ts';

const formatKeywords = (keywords: string[] | string) =>
    Array.isArray(keywords) ? keywords?.[0]?.split(',') : (keywords as string).split(',');

const createKeyword = async (keyword: KeywordType) => {
    try {
        if (!keyword?.label?.length) return null;
        const created = await getPrismaClient().keyword.create({
            data: {
                appId: (keyword.module?.appId ?? keyword.appId)!,
                label: keyword.label,
                module: keyword.module
                    ? (keyword.module as unknown as Prisma.InputJsonValue)
                    : undefined,
            },
        });
        return { ...created, _id: created.id };
    } catch (error) {
        AppLogger.error('[KeywordProvider - createKeyword] error: ', error);
        return null;
    }
};

const insertKeywordList = async (keywordList: KeywordType[]) => {
    try {
        if (!keywordList?.length) return null;

        const records = keywordList
            .filter((keyword) => keyword?.label?.length)
            .map((keyword) => ({
                appId: (keyword.module?.appId ?? keyword.appId)!,
                label: keyword.label,
                module: keyword.module
                    ? (keyword.module as unknown as Prisma.InputJsonValue)
                    : undefined,
            })) as Prisma.KeywordCreateManyInput[];

        if (!records.length) return null;
        await getPrismaClient().keyword.createMany({ data: records, skipDuplicates: true });
    } catch (error) {
        AppLogger.error('[KeywordProvider - insertKeywordList] error: ', error);
    }
};

const editKeyword = async (keyword: KeywordType) => {
    try {
        if (!keyword?._id || !keyword?.label?.length) return null;
        await getPrismaClient().keyword.update({
            where: { id: keyword._id },
            data: { label: keyword.label },
        });
        return { _id: keyword._id };
    } catch (error) {
        AppLogger.error('[KeywordProvider - editKeyword] error: ', error);
        return null;
    }
};

const deleteKeyword = async ({ _id }: KeywordType) => {
    try {
        if (!_id) return null;
        await getPrismaClient().keyword.delete({ where: { id: _id } });
        return { _id };
    } catch (error) {
        AppLogger.error('[KeywordProvider - deleteKeyword] error: ', error);
        return null;
    }
};

const deleteKeywordList = async () => {
    try {
        await getPrismaClient().keyword.deleteMany();
        return true;
    } catch (error) {
        AppLogger.error('[KeywordProvider - deleteKeywordList] error: ', error);
        return false;
    }
};

const getApplicationsIdsByKeywords = async ({
    keywords,
}: SearchQueryType): Promise<number[] | null | undefined> => {
    try {
        if (!keywords?.length) return null;
        const keywordList = await getPrismaClient().keyword.findMany({
            where: { label: { in: formatKeywords(keywords) } },
        });
        if (!keywordList?.length) return null;
        const uniqueAppIds = new Set<number>(keywordList.map((item) => item.appId));
        return uniqueAppIds.size ? [...uniqueAppIds] : null;
    } catch (error) {
        AppLogger.error('[KeywordProvider - getApplicationsIdsByKeywords] error: ', error);
        return null;
    }
};

const getKeywordListByPageAndParams = async ({ appId }: KeywordType) => {
    try {
        const list = await getPrismaClient().keyword.findMany({
            where: appId ? { appId } : undefined,
        });
        return list.map((item) => ({ ...item, _id: item.id }));
    } catch (error) {
        AppLogger.error('[KeywordProvider - getKeywordListByPageAndParams] error: ', error);
        return [];
    }
};

const getKeywordsStatsByParams = async ({
    keywords,
}: SearchQueryType): Promise<KeywordStatsType[] | null> => {
    try {
        if (!keywords?.length) return null;
        const keywordList = await getPrismaClient().keyword.findMany({
            where: { label: { in: formatKeywords(keywords) } },
        });
        if (!keywordList?.length) return null;

        const keywordStatsMap = new Map<string, number>();
        const visitedAppIds = new Set<string>();

        for (const { appId, label } of keywordList) {
            if (!label?.length || !appId) continue;
            if (visitedAppIds.has(label + '-' + appId)) continue;
            visitedAppIds.add(label + '-' + appId);
            keywordStatsMap.set(label, (keywordStatsMap.get(label) || 0) + 1);
        }

        return Array.from(keywordStatsMap).map(([label, total]) => ({ keyword: { label }, total }));
    } catch (error) {
        AppLogger.error('[KeywordProvider - getKeywordsStatsByParams] error: ', error);
        return null;
    }
};

const KeywordProvider = {
    createKeyword,
    insertKeywordList,
    editKeyword,
    deleteKeyword,
    deleteKeywordList,
    getApplicationsIdsByKeywords,
    getKeywordListByPageAndParams,
    getKeywordsStatsByParams,
};
export default KeywordProvider;

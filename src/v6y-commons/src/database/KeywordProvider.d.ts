import { KeywordStatsType, KeywordType } from '../types/KeywordType.ts';
import { SearchQueryType } from '../types/SearchQueryType.ts';
import { KeywordModelType } from './models/KeywordModel.ts';
declare const KeywordProvider: {
    createKeyword: (keyword: KeywordType) => Promise<KeywordModelType | null>;
    insertKeywordList: (keywordList: KeywordType[]) => Promise<null | undefined>;
    editKeyword: (keyword: KeywordType) => Promise<{
        _id: number;
    } | null>;
    deleteKeyword: ({ _id }: KeywordType) => Promise<{
        _id: number;
    } | null>;
    deleteKeywordList: () => Promise<boolean>;
    getKeywordsStatsByParams: ({ keywords, }: SearchQueryType) => Promise<KeywordStatsType[] | null>;
    getKeywordListByPageAndParams: ({ appId }: KeywordType) => Promise<KeywordModelType[]>;
};
export default KeywordProvider;

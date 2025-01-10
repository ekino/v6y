import { ModuleType } from './ModuleType.ts';

export interface KeywordType {
    _id?: number;
    appId?: number;
    label?: string;
    module?: ModuleType;
    status?: string;
}

export interface KeywordStatsType {
    keyword: KeywordType;
    total: number;
}

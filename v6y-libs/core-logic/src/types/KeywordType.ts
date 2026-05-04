import { ModuleType } from './ModuleType.ts';

export interface KeywordType {
    _id?: number;
    appId?: number;
    moduleId?: number;
    label?: string;
    /** Resolved via JOIN on read; accepted as input for write (triggers findOrCreate). */
    module?: ModuleType;
    status?: string;
}

export interface KeywordStatsType {
    keyword: KeywordType;
    total: number;
}

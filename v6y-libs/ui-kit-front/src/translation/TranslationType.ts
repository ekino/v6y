import { TFunction } from 'i18next';

export type TranslateType = (key: string, params?: TFunction) => string | undefined;

export interface TranslationType {
    translate: TranslateType;
    changeLocale: (lang: string) => void;
    getLocale: () => string | undefined;
}

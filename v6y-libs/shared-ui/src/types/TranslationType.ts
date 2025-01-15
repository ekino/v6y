export type TranslateType = (key: string, params?: unknown) => string | undefined;

export interface TranslationType {
    translate: TranslateType;
    changeLocale: (lang: string) => void;
    getLocale: () => string | undefined;
}

'use client';

import { TFunction } from 'i18next';
import { useTranslation as useNextTranslate } from 'react-i18next';

export const useTranslationProvider = () => {
    const { t, i18n } = useNextTranslate();

    return {
        translateHelper: t,
        i18n,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        translate: (key: string, params?: TFunction) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };
};

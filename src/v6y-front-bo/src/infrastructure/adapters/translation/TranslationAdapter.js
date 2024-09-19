'use client';

import { useTranslation as useRefineTranslate } from '@refinedev/core';
import { useTranslation as useNextTranslationHelper } from 'next-i18next';

export const useNextTranslation = () => {
    const { t, i18n } = useNextTranslationHelper();

    return {
        translateHelper: t,
        i18nHelper: i18n,
    };
};

export const useTranslation = () => {
    const { translate, getLocale, changeLocale } = useRefineTranslate();

    return {
        translate,
        getLocale,
        changeLocale,
    };
};

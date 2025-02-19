'use client';

import { useTranslation as useRefineTranslate } from '@refinedev/core';
import { useTranslation as useNextTranslate } from 'react-i18next';

import { TranslationType } from './TranslationType';

export const useTranslationProvider = () => {
    const { t, i18n } = useNextTranslate();
    const { translate, getLocale, changeLocale }: TranslationType = useRefineTranslate();

    return {
        translateHelper: t,
        i18n,
        translate,
        getLocale,
        changeLocale,
    };
};

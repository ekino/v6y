'use client';

import { useTranslation as useRefineTranslate } from '@refinedev/core';
import { useTranslation as useNextTranslationHelper } from 'react-i18next';

import { TranslationType } from '../../types/TranslationType';

export const useNextTranslation = () => {
    const { t, i18n } = useNextTranslationHelper();

    return {
        translateHelper: t,
        i18n,
    };
};

export const useTranslation = () => {
    const { translate, getLocale, changeLocale }: TranslationType = useRefineTranslate();

    return {
        translate,
        getLocale,
        changeLocale,
    };
};

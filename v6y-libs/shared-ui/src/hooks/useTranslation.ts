'use client';

import { useTranslation as useRefineTranslate } from '@refinedev/core';

import { TranslationType } from '../types/TranslationType.ts';

export const useTranslation = () => {
    const { translate, getLocale, changeLocale }: TranslationType = useRefineTranslate();

    return {
        translate,
        getLocale,
        changeLocale,
    };
};

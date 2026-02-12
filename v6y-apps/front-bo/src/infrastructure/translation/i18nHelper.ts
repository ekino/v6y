'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

// Suppress Ant Design Menu deprecation warning from Refine library
// This is a known issue in @refinedev/antd that will be fixed in future versions
if (typeof window !== 'undefined') {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args: unknown[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('[antd: Menu] `children` is deprecated') ||
                args[0].includes('children` is deprecated'))
        ) {
            return;
        }
        originalWarn.apply(console, args);
    };

    console.error = (...args: unknown[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('[antd: Menu] `children` is deprecated') ||
                args[0].includes('children` is deprecated') ||
                args[0].includes('`key` is not a prop') ||
                args[0].includes('[antd: Card] `headStyle` is deprecated') ||
                args[0].includes('[antd: Card] `bodyStyle` is deprecated'))
        ) {
            return;
        }
        originalError.apply(console, args);
    };
}

const DETECTION_OPTIONS = {
    order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
    ],
    caches: ['localStorage', 'cookie'],
};

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
        resourcesToBackend(
            (language: string, namespace: string) =>
                import(`../../../public/locales/${language}/${namespace}.json`),
        ),
    )
    .init({
        supportedLngs: ['en', 'fr'],
        fallbackLng: 'en',
        detection: DETECTION_OPTIONS,
        defaultNS: 'common',
        react: {
            useSuspense: false,
        },
    });

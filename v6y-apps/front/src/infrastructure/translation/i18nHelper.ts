'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

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

const FALLBACK_LOCALE = 'en';

if (!i18next.isInitialized) {
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
            // Boot with the SSR fallback locale explicitly: passing `lng`
            // makes i18next skip `LanguageDetector`'s synchronous detect()
            // call at init time. Without this, the detector resolves a
            // cached locale (e.g. 'fr' from localStorage/cookies) before
            // React starts hydrating, so any component rendering translated
            // text mismatches the server's fallback-only render, throwing a
            // hydration error. The real cached locale is applied after
            // mount instead, via `applyDetectedLocale()` below.
            lng: FALLBACK_LOCALE,
            supportedLngs: ['en', 'fr'],
            fallbackLng: FALLBACK_LOCALE,
            detection: DETECTION_OPTIONS,
            defaultNS: 'common',
        });
}

/**
 * Client-only: resolves the user's previously detected/cached locale (via
 * the same `i18next-browser-languagedetector` instance registered above)
 * and switches to it. Must be called after the initial hydration-safe
 * render (e.g. from a `useEffect`) so the language change happens as a
 * normal client-side update rather than during hydration comparison.
 */
export const applyDetectedLocale = () => {
    if (typeof window === 'undefined') return;

    const detected = i18next.services.languageDetector?.detect();
    const detectedLocale = Array.isArray(detected) ? detected[0] : detected;

    if (detectedLocale && detectedLocale !== i18next.language) {
        i18next.changeLanguage(detectedLocale);
    }
};

export default i18next;

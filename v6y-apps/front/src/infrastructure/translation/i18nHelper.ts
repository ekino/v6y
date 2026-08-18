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
            // Pin the initial language to the fallback so i18next skips
            // LanguageDetector's synchronous detect() during init. Otherwise the
            // client resolves the cached locale (e.g. 'fr') before hydration while
            // the server renders 'en', causing a hydration mismatch. The real
            // locale is applied post-mount via applyDetectedLocale().
            lng: 'en',
            supportedLngs: ['en', 'fr'],
            fallbackLng: 'en',
            detection: DETECTION_OPTIONS,
            defaultNS: 'common',
        });
}

/**
 * Applies the browser-detected locale. Must be called from a client-only
 * useEffect (post-mount) so the switch happens as a normal re-render rather
 * than during hydration.
 */
export const applyDetectedLocale = () => {
    const detected = i18next.services.languageDetector?.detect();
    const nextLng = Array.isArray(detected) ? detected[0] : detected;
    if (nextLng && nextLng !== i18next.language) {
        i18next.changeLanguage(nextLng);
    }
};

export default i18next;

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from 'next/headers';
import { cache } from 'react';

// Cached per request/render so repeated translation calls with the same
// language reuse one initialized instance instead of re-importing the
// locale backend and re-running i18next.init() for every single key.
const createI18nInstance = cache(async (lng: string) => {
    const i18n = i18next.createInstance();

    await i18n
        .use(
            resourcesToBackend(
                (language: string, namespace: string) =>
                    import(`../../../public/locales/${language}/${namespace}.json`),
            ),
        )
        .init({
            lng,
            fallbackLng: 'en',
            defaultNS: 'common',
            ns: ['common'],
        });

    return i18n;
});

const getI18nInstance = async () => {
    const cookieStore = await cookies();
    const lng = cookieStore.get('i18next')?.value || 'en';

    return createI18nInstance(lng);
};

// Resolves several keys against a single shared i18n instance, avoiding the
// sequential-awaits-each-re-initializing-i18next pattern of calling one
// translation per await. `keys` maps a local name to its i18n
// key, e.g. { title: 'vitality.notFound.title' }.
export const getServerTranslations = async <T extends Record<string, string>>(
    keys: T,
): Promise<{ [K in keyof T]: string }> => {
    const i18n = await getI18nInstance();

    return Object.fromEntries(Object.entries(keys).map(([name, key]) => [name, i18n.t(key)])) as {
        [K in keyof T]: string;
    };
};

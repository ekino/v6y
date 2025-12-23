import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from 'next/headers';

const createI18nInstance = async (lng: string) => {
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
};

export const getServerTranslation = async (key: string, params?: Record<string, unknown>) => {
    const cookieStore = await cookies();
    const lng = cookieStore.get('i18next')?.value || 'en';

    const i18n = await createI18nInstance(lng);
    return i18n.t(key, params);
};

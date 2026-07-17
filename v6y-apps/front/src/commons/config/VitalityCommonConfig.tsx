import { ApplicationType } from '@v6y/core-logic/src/types';
import { Matcher } from '@v6y/core-logic/src/utils';

import VitalityNavigationPaths from './VitalityNavigationPaths';

export interface BreadCrumbItemType {
    currentPage: string;
    lastPage: string;
    urlParams: string;
    translate: (key: string) => string;
}

export interface BreadCrumbDisplayItem {
    title: string;
    href?: string;
}

export const AUDIT_REPORT_TYPES = {
    lighthouse: 'Lighthouse',
    codeModularity: 'Code-Modularity',
    codeComplexity: 'Code-Complexity',
    codeCoupling: 'Code-Coupling',
    codeSecurity: 'Code-Security',
    codeDuplication: 'Code-Duplication',
    dora: 'DORA',
};

export const buildBreadCrumbItems = ({
    currentPage,
    lastPage,
    urlParams,
    translate,
}: BreadCrumbItemType) => {
    const sourceParams =
        (urlParams || '')
            .split('&')
            .filter((url) => !url.includes('source') && !url.includes('_id'))
            .join('&') || '';
    const withSourceParams = (path: string) => (sourceParams ? `${path}?${sourceParams}` : path);

    const isProjectDetailsPage = /^\/app\/\d+$/.test(currentPage);
    const reportDetailsMatch = currentPage.match(/^\/app\/(\d+)\/reports\/(\d+)$/);

    const sourceItem = {
        title: Matcher()
            .on(
                () => lastPage === 'stats',
                () => translate('vitality.appStatsPage.shortTitle'),
            )
            .on(
                () => lastPage === 'search',
                () => translate('vitality.searchPage.shortTitle'),
            )
            .otherwise(() => translate('vitality.appListPage.shortTitle')),
        href: Matcher()
            .on(
                () => lastPage === 'stats',
                () => withSourceParams(VitalityNavigationPaths.APPS_STATS),
            )
            .on(
                () => lastPage === 'search',
                () => withSourceParams(VitalityNavigationPaths.SEARCH),
            )
            .otherwise(() => withSourceParams(VitalityNavigationPaths.APP_LIST)),
    };

    if (isProjectDetailsPage) {
        return [
            {
                title: translate('vitality.dashboardPage.shortTitle'),
                href: VitalityNavigationPaths.DASHBOARD,
            },
            sourceItem,
            {
                title: translate('vitality.appDetailsPage.shortTitle'),
            },
        ];
    }

    if (reportDetailsMatch) {
        const projectHref = withSourceParams(
            `${VitalityNavigationPaths.APP}/${reportDetailsMatch[1]}`,
        );
        return [
            {
                title: translate('vitality.dashboardPage.shortTitle'),
                href: VitalityNavigationPaths.DASHBOARD,
            },
            sourceItem,
            {
                title: translate('vitality.appDetailsPage.shortTitle'),
                href: projectHref,
            },
            {
                title: translate('vitality.appDetailsPage.auditReports.categories.general'),
            },
        ];
    }

    return (
        {
            [VitalityNavigationPaths.APP_DETAILS]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                sourceItem,
                {
                    title: translate('vitality.appDetailsPage.shortTitle'),
                },
            ],
            [VitalityNavigationPaths.DASHBOARD]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                },
            ],
            [VitalityNavigationPaths.APP_LIST]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                {
                    title: translate('vitality.appListPage.shortTitle'),
                },
            ],
            [VitalityNavigationPaths.FAQ]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                {
                    title: translate('vitality.faqPage.shortTitle'),
                },
            ],
            [VitalityNavigationPaths.NOTIFICATIONS]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                {
                    title: translate('vitality.notificationsPage.shortTitle'),
                },
            ],
            [VitalityNavigationPaths.APPS_STATS]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                {
                    title: translate('vitality.appStatsPage.shortTitle'),
                },
            ],
            [VitalityNavigationPaths.SEARCH]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                {
                    title: translate('vitality.searchPage.shortTitle'),
                },
            ],
        }[currentPage] || []
    );
};

export const buildPageTitle = (pathname: string, translate: (key: string) => string) => {
    if (/^\/app\/\d+$/.test(pathname)) {
        return translate('vitality.appDetailsPage.pageTitle');
    }

    if (/^\/app\/\d+\/reports\/\d+$/.test(pathname)) {
        return translate('vitality.appDetailsPage.pageTitle');
    }

    return (
        {
            [VitalityNavigationPaths.DASHBOARD]: translate('vitality.dashboardPage.pageTitle'),
            [VitalityNavigationPaths.APP_LIST]: translate('vitality.appListPage.pageTitle'),
            [VitalityNavigationPaths.APP_DETAILS]: translate('vitality.appDetailsPage.pageTitle'),
            [VitalityNavigationPaths.APPS_STATS]: translate('vitality.appStatsPage.pageTitle'),
        }[pathname] || []
    );
};

export const formatApplicationDataSource = (
    pagedData: Array<{ getApplicationListByPageAndParams: ApplicationType }>,
): Array<ApplicationType> => {
    const mergedAppList = pagedData
        ?.map((page) => {
            return page?.getApplicationListByPageAndParams;
        })
        ?.flat();

    if (!mergedAppList?.length) {
        return mergedAppList;
    }

    const newDataSource: ApplicationType[] = [];

    for (const app of mergedAppList) {
        const isAppExist = newDataSource.some((oldApp) => oldApp._id === app._id);
        if (!isAppExist) {
            newDataSource.push(app);
        }
    }

    return newDataSource;
};

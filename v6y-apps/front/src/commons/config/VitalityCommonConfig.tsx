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

    const sourceItem =
        lastPage === 'dashboard'
            ? undefined
            : {
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

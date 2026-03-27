import * as React from 'react';
import { ReactNode } from 'react';

import { ApplicationType } from '@v6y/core-logic/src/types';
import { Matcher } from '@v6y/core-logic/src/utils';
import {
    ApiOutlined,
    AppstoreAddOutlined,
    DashboardOutlined,
    PieChartOutlined,
    SplitCellsOutlined,
    ThemeTokenType,
} from '@v6y/ui-kit';

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

export interface DashboardItemType {
    autoFocus: boolean;
    defaultChecked: boolean;
    title: string;
    description: string;
    url: string;
    avatar: ReactNode;
    avatarColor: string;
}

export const buildDashboardMenuItems = (themeToken: ThemeTokenType | undefined) =>
    [
        {
            autoFocus: true,
            defaultChecked: false,
            title: 'React',
            description: 'Choose this option to view React applications.',
            url: VitalityNavigationPaths.APP_LIST + '?keywords=react',
            avatar: <DashboardOutlined />,
            avatarColor: themeToken?.colorPrimary,
        },
        {
            autoFocus: false,
            defaultChecked: false,
            title: 'Angular',
            description: 'Choose this option to view Angular applications.',
            url: VitalityNavigationPaths.APP_LIST + '?keywords=angular',
            avatar: <AppstoreAddOutlined />,
            avatarColor: themeToken?.colorSecondary,
        },
        {
            autoFocus: false,
            defaultChecked: false,
            title: 'React Legacy',
            description: 'Choose this option to view React Legacy applications.',
            url: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-react',
            avatar: <SplitCellsOutlined />,
            avatarColor: themeToken?.colorError,
        },
        {
            autoFocus: false,
            defaultChecked: false,
            title: 'Angular Legacy',
            description: 'Choose this option to view Angular Legacy applications.',
            url: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-angular',
            avatar: <ApiOutlined />,
            avatarColor: themeToken?.colorWarning,
        },
        {
            autoFocus: false,
            defaultChecked: false,
            title: 'Health statistics',
            description: 'Choose this option to see health statistics for all apps.',
            url: VitalityNavigationPaths.APPS_STATS,
            avatar: <PieChartOutlined />,
            avatarColor: themeToken?.colorInfo,
        },
    ] as DashboardItemType[];

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

    return (
        {
            [VitalityNavigationPaths.APP_DETAILS]: [
                {
                    title: translate('vitality.dashboardPage.shortTitle'),
                    href: VitalityNavigationPaths.DASHBOARD,
                },
                {
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
                },
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

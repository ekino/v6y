import { ApplicationType } from '@v6y/core-logic/src/types';
import { Matcher } from '@v6y/core-logic/src/utils';
import {
    ApiOutlined,
    AppstoreAddOutlined,
    DashboardOutlined,
    LogoutOutlined,
    NotificationOutlined,
    PieChartOutlined,
    QuestionOutlined,
    SplitCellsOutlined,
    TextView,
    ThemeTokenType,
} from '@v6y/ui-kit';
import Link from 'next/link';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityNavigationPaths from './VitalityNavigationPaths';

export interface BreadCrumbItemType {
    currentPage: string;
    lastPage: string;
    urlParams: string;
    translate: (key: string) => string;
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
    const dashboardLink = (
        <Link href={VitalityNavigationPaths.DASHBOARD}>
            {translate('vitality.dashboardPage.shortTitle')}
        </Link>
    );

    const sourceParams =
        (urlParams || '')
            .split('&')
            .filter((url) => !url.includes('source') && !url.includes('_id'))
            .join('&') || '';
    const appListLink = (
        <Link href={VitalityNavigationPaths.APP_LIST + '?' + sourceParams}>
            {translate('vitality.appListPage.shortTitle')}
        </Link>
    );
    const appsStatsLink = (
        <Link href={VitalityNavigationPaths.APPS_STATS + '?' + sourceParams}>
            {translate('vitality.appStatsPage.shortTitle')}
        </Link>
    );
    const searchLink = (
        <Link href={VitalityNavigationPaths.SEARCH + '?' + sourceParams}>
            {translate('vitality.searchPage.shortTitle')}
        </Link>
    );

    return (
        {
            [VitalityNavigationPaths.APP_DETAILS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: Matcher()
                        .on(
                            () => lastPage === 'stats',
                            () => appsStatsLink,
                        )
                        .on(
                            () => lastPage === 'search',
                            () => searchLink,
                        )
                        .otherwise(() => appListLink),
                },
                {
                    title: <Link href="">{translate('vitality.appDetailsPage.shortTitle')}</Link>,
                },
            ],
            [VitalityNavigationPaths.DASHBOARD]: [],
            [VitalityNavigationPaths.APP_LIST]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{translate('vitality.appListPage.shortTitle')}</Link>,
                },
            ],
            [VitalityNavigationPaths.FAQ]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{translate('vitality.faqPage.shortTitle')}</Link>,
                },
            ],
            [VitalityNavigationPaths.NOTIFICATIONS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: (
                        <Link href="">{translate('vitality.notificationsPage.shortTitle')}</Link>
                    ),
                },
            ],
            [VitalityNavigationPaths.APPS_STATS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{translate('vitality.appStatsPage.shortTitle')}</Link>,
                },
            ],
            [VitalityNavigationPaths.SEARCH]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{translate('vitality.searchPage.shortTitle')}</Link>,
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

export const VITALITY_HEADER_MENU_ITEMS = [
    {
        key: 'dashboard',
        link: VitalityNavigationPaths.DASHBOARD,
        translateLabel: 'vitality.header.menu.dashboard'
    },
    {
        key: 'statistics',
        link: VitalityNavigationPaths.APPS_STATS,
        translateLabel: 'vitality.header.menu.apps-stats'
    },
];

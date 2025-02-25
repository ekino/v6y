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
    ThemeTokenType,
    VitalityText,
} from '@v6y/shared-ui';
import Link from 'next/link';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityNavigationPaths from './VitalityNavigationPaths';
import VitalityTerms from './VitalityTerms';

export interface BreadCrumbItemType {
    currentPage: string;
    lastPage: string;
    urlParams: string;
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
            title: VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE,
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
};

export const buildBreadCrumbItems = ({ currentPage, lastPage, urlParams }: BreadCrumbItemType) => {
    const dashboardLink = <Link href={VitalityNavigationPaths.DASHBOARD}>Dashboard</Link>;

    const sourceParams =
        (urlParams || '')
            .split('&')
            .filter((url) => !url.includes('source') && !url.includes('_id'))
            .join('&') || '';
    const appListLink = (
        <Link href={VitalityNavigationPaths.APP_LIST + '?' + sourceParams}>
            {VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE}
        </Link>
    );
    const appsStatsLink = (
        <Link href={VitalityNavigationPaths.APPS_STATS + '?' + sourceParams}>
            {VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE}
        </Link>
    );
    const searchLink = (
        <Link href={VitalityNavigationPaths.SEARCH + '?' + sourceParams}>
            {VitalityTerms.VITALITY_SEARCH_PAGE_TITLE}
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
                    title: <Link href="">{VitalityTerms.VITALITY_APP_DETAILS_PAGE_TITLE}</Link>,
                },
            ],
            [VitalityNavigationPaths.DASHBOARD]: [],
            [VitalityNavigationPaths.APP_LIST]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE}</Link>,
                },
            ],
            [VitalityNavigationPaths.FAQ]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_FAQ_PAGE_TITLE}</Link>,
                },
            ],
            [VitalityNavigationPaths.NOTIFICATIONS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_NOTIFICATIONS_PAGE_TITLE}</Link>,
                },
            ],
            [VitalityNavigationPaths.APPS_STATS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE}</Link>,
                },
            ],
            [VitalityNavigationPaths.SEARCH]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_SEARCH_PAGE_TITLE}</Link>,
                },
            ],
        }[currentPage] || []
    );
};

export const buildPageTitle = (pathname: string) =>
    ({
        [VitalityNavigationPaths.DASHBOARD]: VitalityTerms.VITALITY_DASHBOARD_PAGE_TITLE,
        [VitalityNavigationPaths.APP_LIST]: VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE,
        [VitalityNavigationPaths.APP_DETAILS]: VitalityTerms.VITALITY_APP_DETAILS_PAGE_TITLE,
        [VitalityNavigationPaths.APPS_STATS]: VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE,
    })[pathname] || [];

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

const VITALITY_HEADER_MENU_ITEMS = [
    {
        key: 'notification',
        icon: <NotificationOutlined />,
        label: (
            <Link href={VitalityNavigationPaths.NOTIFICATIONS} style={{ textDecoration: 'none' }}>
                <VitalityText text="Notifications" />
            </Link>
        ),
    },
    {
        key: 'FAQ',
        icon: <QuestionOutlined />,
        label: (
            <Link href={VitalityNavigationPaths.FAQ} style={{ textDecoration: 'none' }}>
                <VitalityText text="FAQ" />
            </Link>
        ),
    },
];

export const buildVitalityHeaderMenuItems = (isLogged: boolean, onLogout: () => void) => [
    ...VITALITY_HEADER_MENU_ITEMS,
    isLogged && {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: (
            <Link
                href={VitalityNavigationPaths.LOGIN}
                onClick={onLogout}
                style={{ textDecoration: 'none' }}
            >
                <VitalityText text="Logout" />
            </Link>
        ),
    },
];

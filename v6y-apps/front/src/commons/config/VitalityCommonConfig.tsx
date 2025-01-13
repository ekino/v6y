import {
    ApiOutlined,
    AppstoreAddOutlined,
    DashboardOutlined,
    DislikeOutlined,
    LikeOutlined,
    LogoutOutlined,
    NotificationOutlined,
    PieChartOutlined,
    QuestionOutlined,
    SplitCellsOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import { ApplicationType } from '@v6y/core-logic';
import Matcher from '@v6y/core-logic/src/core/Matcher';
import { Typography } from 'antd';
import Link from 'next/link';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityNavigationPaths from './VitalityNavigationPaths';
import VitalityTerms from './VitalityTerms';
import VitalityTheme from './VitalityTheme';

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

export const VITALITY_DASHBOARD_DATASOURCE: DashboardItemType[] = [
    {
        autoFocus: true,
        defaultChecked: false,
        title: 'React',
        description: 'Choose this option to view React applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=react',
        avatar: <DashboardOutlined />,
        avatarColor: VitalityTheme.token.colorPrimary,
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular',
        description: 'Choose this option to view Angular applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=angular',
        avatar: <AppstoreAddOutlined />,
        avatarColor: VitalityTheme.token.colorSecondary,
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'React Legacy',
        description: 'Choose this option to view React Legacy applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-react',
        avatar: <SplitCellsOutlined />,
        avatarColor: VitalityTheme.token.colorError,
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular Legacy',
        description: 'Choose this option to view Angular Legacy applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-angular',
        avatar: <ApiOutlined />,
        avatarColor: VitalityTheme.token.colorWarning,
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE,
        description: 'Choose this option to see health statistics for all apps.',
        url: VitalityNavigationPaths.APPS_STATS,
        avatar: <PieChartOutlined />,
        avatarColor: VitalityTheme.token.colorInfo,
    },
];

export const AUDIT_REPORT_TYPES = {
    lighthouse: 'Lighthouse',
    codeModularity: 'Code-Modularity',
    codeComplexity: 'Code-Complexity',
    codeCoupling: 'Code-Coupling',
    codeSecurity: 'Code-Security',
    codeDuplication: 'Code-Duplication',
};

export const AUDIT_STATUS_COLORS = {
    success: VitalityTheme.token.colorSuccess,
    warning: VitalityTheme.token.colorWarning,
    error: VitalityTheme.token.colorError,
};

export const DEPENDENCIES_STATUS_INFOS = {
    'up-to-date': {
        statusColor: VitalityTheme.token.colorSuccess,
        statusLabel: 'Up-to-date',
    },
    outdated: {
        statusColor: VitalityTheme.token.colorWarning,
        statusLabel: 'Outdated',
    },
    deprecated: {
        statusColor: VitalityTheme.token.colorError,
        statusLabel: 'Deprecated',
    },
};

// critical, important, recommended
export const EVOLUTIONS_STATUS_INFOS = {
    critical: {
        statusColor: 'error',
        statusLabel: 'Critical',
    },
    important: {
        statusColor: 'warning',
        statusLabel: 'Important',
    },
    recommended: {
        statusColor: 'processing',
        statusLabel: 'Recommended',
    },
};

export const QUALITY_METRIC_STATUS = {
    success: VitalityTheme.token.colorSuccess,
    warning: VitalityTheme.token.colorWarning,
    error: VitalityTheme.token.colorError,
    'up-to-date': VitalityTheme.token.colorSuccess,
    outdated: VitalityTheme.token.colorWarning,
    deprecated: VitalityTheme.token.colorError,
    default: VitalityTheme.token.colorInfo,
    important: VitalityTheme.token.colorWarning,
    critical: VitalityTheme.token.colorError,
    recommended: VitalityTheme.token.colorInfo,
};

export const QUALITY_METRIC_ICONS = {
    success: <LikeOutlined />,
    warning: <DislikeOutlined />,
    error: <DislikeOutlined />,
    'up-to-date': <LikeOutlined />,
    outdated: <DislikeOutlined />,
    deprecated: <DislikeOutlined />,
    default: <ThunderboltOutlined />,
    info: <ThunderboltOutlined />,
    important: <ThunderboltOutlined />,
    critical: <ThunderboltOutlined />,
    recommended: <ThunderboltOutlined />,
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
                <Typography.Text>Notifications</Typography.Text>
            </Link>
        ),
    },
    {
        key: 'FAQ',
        icon: <QuestionOutlined />,
        label: (
            <Link href={VitalityNavigationPaths.FAQ} style={{ textDecoration: 'none' }}>
                <Typography.Text>FAQ</Typography.Text>
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
                <Typography.Text>Logout</Typography.Text>
            </Link>
        ),
    },
];

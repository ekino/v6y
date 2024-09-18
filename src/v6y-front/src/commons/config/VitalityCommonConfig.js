import {
    DislikeOutlined,
    FrownOutlined,
    LikeOutlined,
    MehOutlined,
    SmileOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import Link from 'next/link.js';
import React from 'react';

import { Matcher } from '../../infrastructure/utils/Matcher.js';
import VitalityNavigationPaths from './VitalityNavigationPaths.js';
import VitalityTerms from './VitalityTerms.js';
import VitalityTheme from './VitalityTheme.js';

export const VITALITY_DASHBOARD_DATASOURCE = [
    {
        autoFocus: true,
        defaultChecked: false,
        title: 'React',
        description: 'Choose this option to view React applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=react',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular',
        description: 'Choose this option to view Angular applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=angular',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'React Legacy',
        description: 'Choose this option to view React Legacy applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-react',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: 'Angular Legacy',
        description: 'Choose this option to view Angular Legacy applications.',
        url: VitalityNavigationPaths.APP_LIST + '?keywords=legacy-angular',
        imageUrl: '',
    },
    {
        autoFocus: false,
        defaultChecked: false,
        title: VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE,
        description: 'Choose this option to see stats for all apps.',
        url: VitalityNavigationPaths.APPS_STATS,
        imageUrl: '',
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

export const buildBreadCrumbItems = ({ currentPage, lastPage, urlParams }) => {
    const dashboardLink = <Link href={VitalityNavigationPaths.DASHBOARD}>Dashboard</Link>;

    const sourceParams =
        (urlParams || '')
            .split('&')
            .filter((url) => !url.includes('source') && !url.includes('appId'))
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
                        .with(
                            () => lastPage === 'stats',
                            () => appsStatsLink,
                        )
                        .with(
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

export const buildPageTitle = (pathname) =>
    ({
        [VitalityNavigationPaths.DASHBOARD]: VitalityTerms.VITALITY_DASHBOARD_PAGE_TITLE,
        [VitalityNavigationPaths.APP_LIST]: VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE,
        [VitalityNavigationPaths.APP_DETAILS]: VitalityTerms.VITALITY_APP_DETAILS_PAGE_TITLE,
        [VitalityNavigationPaths.APPS_STATS]: VitalityTerms.VITALITY_APP_STATS_PAGE_TITLE,
    })[pathname] || [];

export const normalizeDependencyVersion = (version) => version?.replace('=', '');

export const buildUniqueBranches = (moduleKey, modules) => [
    ...(new Set(
        modules
            ?.filter(
                (module) =>
                    module.branch?.length &&
                    (moduleKey === module.name ||
                        moduleKey === module.category ||
                        moduleKey === module.label),
            )
            ?.map((module) => `${module.branch}XXX${module.status}`),
    ) || []),
];

export const buildUniquePaths = (moduleKey, modules) => [
    ...(new Set(
        modules
            ?.filter(
                (module) =>
                    module.path &&
                    (moduleKey === module.name ||
                        moduleKey === module.category ||
                        moduleKey === module.label),
            )
            ?.map((module) => `${module.path}XXX${module.status}`),
    ) || []),
];

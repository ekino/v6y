import Link from 'next/link.js';

import { Matcher } from '../../infrastructure/utils/Matcher.js';
import VitalityLegend from '../components/VitalityLegend.jsx';
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
        imageUrl: 'react_logo.svg',
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
    codeCompliance: 'Code Compliance',
    codeComplexity: 'Code Complexity',
    codeCoupling: 'Code Coupling',
    lighthouse: 'Lighthouse',
    codeSecurity: 'Code Security',
    codeDuplication: 'Code Duplication',
};

export const AUDIT_STATUS_COLORS = {
    success: VitalityTheme.token.colorSuccess,
    warning: VitalityTheme.token.colorWarning,
    error: VitalityTheme.token.colorError,
};

export const DEPENDENCIES_STATUS_INFOS = {
    'up-to-date': {
        statusColor: 'success',
        statusLabel: 'Up-to-date',
    },
    outdated: {
        statusColor: 'error',
        statusLabel: 'Outdated',
    },
    deprecated: {
        statusColor: 'warning',
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

export const normalizeDependencyVersion = (version) => version?.replace('=', '');

export const formatHelpOptions = (options) => {
    if (!options?.length) {
        return [];
    }

    return options
        .filter((option) => option.title?.length)
        .map((option) => ({
            key: option.title,
            label: `${option.title}${option.branch?.length ? ` - (branch: ${option.branch})` : ''}`,
            children: <VitalityLegend legend={option} />,
            showArrow: true,
        }));
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

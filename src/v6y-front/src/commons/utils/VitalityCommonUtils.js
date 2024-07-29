import Link from 'next/link';
import VitalityLegend from '../components/VitalityLegend.jsx';
import VitalityTerms from '../config/VitalityTerms.js';
import VitalityNavigationPaths from '../config/VitalityNavigationPaths.js';

const getTextWidth = (text) => {
    const padding = 16;
    const margin = 5;
    const defaultWidth = 100;

    if (!text?.length) {
        return defaultWidth + 2 * padding + 2 * margin;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'normal normal 600 16px sourcesanspro';

    return context.measureText(text).width + 2 * padding + 2 * margin;
};

const formatHelpOptions = (options) => {
    if (!options?.length) {
        return [];
    }

    return options
        .filter((option) => option.title?.length)
        .map((option) => ({
            key: option.title,
            label: option.title,
            children: <VitalityLegend legend={option} />,
            showArrow: true,
        }));
};

const buildBreadCrumbItems = (pathname) => {
    const dashboardLink = <Link href={VitalityNavigationPaths.DASHBOARD}>Dashboard</Link>;
    const appListLink = (
        <Link href={VitalityNavigationPaths.APP_LIST}>
            {VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE}
        </Link>
    );
    return (
        {
            [VitalityNavigationPaths.DASHBOARD]: [],
            [VitalityNavigationPaths.APP_LIST]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE}</Link>,
                },
            ],
            [VitalityNavigationPaths.APP_DETAILS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: appListLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_APP_DETAILS_PAGE_TITLE}</Link>,
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
            [VitalityNavigationPaths.STACK_STATS]: [
                {
                    title: dashboardLink,
                },
                {
                    title: <Link href="">{VitalityTerms.VITALITY_STACK_STATS_PAGE_TITLE}</Link>,
                },
            ],
        }[pathname] || []
    );
};

const buildPageTitle = (pathname) =>
    ({
        [VitalityNavigationPaths.DASHBOARD]: VitalityTerms.VITALITY_DASHBOARD_PAGE_TITLE,
        [VitalityNavigationPaths.APP_LIST]: VitalityTerms.VITALITY_APP_LIST_PAGE_TITLE,
        [VitalityNavigationPaths.APP_DETAILS]: VitalityTerms.VITALITY_APP_DETAILS_PAGE_TITLE,
        [VitalityNavigationPaths.FAQ]: VitalityTerms.VITALITY_FAQ_PAGE_TITLE,
        [VitalityNavigationPaths.NOTIFICATIONS]: VitalityTerms.VITALITY_NOTIFICATIONS_PAGE_TITLE,
        [VitalityNavigationPaths.STACK_STATS]: VitalityTerms.VITALITY_STACK_STATS_PAGE_TITLE,
    })[pathname] || [];

const VitalityCommonUtils = {
    getTextWidth,
    formatHelpOptions,
    buildBreadCrumbItems,
    buildPageTitle,
};

export default VitalityCommonUtils;

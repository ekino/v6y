import CommonsDico from '../../dico/CommonsDico.js';
import Link from 'next/link';

export const buildBreadCrumbItems = (pathname) =>
    ({
        '/dashboard': [],
        '/app-list': [
            {
                title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
                title: <Link href="">{CommonsDico.VITALITY_APP_LIST_PAGE_TITLE}</Link>,
            },
        ],
        '/app-details': [
            {
                title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
                title: <Link href="/app-list">{CommonsDico.VITALITY_APP_LIST_PAGE_TITLE}</Link>,
            },
            {
                title: <Link href="">{CommonsDico.VITALITY_APP_DETAILS_PAGE_TITLE}</Link>,
            },
        ],
        '/faq': [
            {
                title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
                title: <Link href="">{CommonsDico.VITALITY_FAQ_PAGE_TITLE}</Link>,
            },
        ],
        '/notifications': [
            {
                title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
                title: <Link href="">{CommonsDico.VITALITY_NOTIFICATIONS_PAGE_TITLE}</Link>,
            },
        ],
        '/socle-stats': [
            {
                title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
                title: <Link href="">{CommonsDico.VITALITY_SOCLE_STATS_PAGE_TITLE}</Link>,
            },
        ],
    })[pathname] || [];

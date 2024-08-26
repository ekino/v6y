export const VitalityPathTree = [
    {
        name: 'Application',
        list: '/applications',
        create: '/application/create',
        edit: '/application/edit/:id',
        show: '/application/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'Notifications',
        list: '/notifications',
        create: '/notification/create',
        edit: '/notification/edit/:id',
        show: '/notification/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'FAQ',
        list: '/faqs',
        create: '/faq/create',
        edit: '/faq/edit/:id',
        show: '/faq/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'Evolution',
        list: '/evolutions',
        create: '/evolution/create',
        edit: '/evolution/edit/:id',
        show: '/evolution/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'Keyword',
        list: '/keywords',
        create: '/keyword/create',
        edit: '/keyword/edit/:id',
        show: '/keyword/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'Audit',
        list: '/audits',
        create: '/audit/create',
        edit: '/audit/edit/:id',
        show: '/audit/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'Dependency',
        list: '/dependencies',
        create: '/dependency/create',
        edit: '/dependency/edit/:id',
        show: '/dependency/show/:id',
        meta: {
            canDelete: true,
        },
    },
];

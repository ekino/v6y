export const VitalityRoutes = [
    {
        name: 'v6y-accounts',
        list: '/v6y-accounts',
        create: '/v6y-accounts/create',
        edit: '/v6y-accounts/edit/:id',
        show: '/v6y-accounts/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-applications',
        list: '/v6y-applications',
        create: '/v6y-applications/create',
        edit: '/v6y-applications/edit/:id',
        show: '/v6y-applications/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-notifications',
        list: '/v6y-notifications',
        create: '/v6y-notifications/create',
        edit: '/v6y-notifications/edit/:id',
        show: '/v6y-notifications/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-faqs',
        list: '/v6y-faqs',
        create: '/v6y-faqs/create',
        edit: '/v6y-faqs/edit/:id',
        show: '/v6y-faqs/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-evolution-helps',
        list: '/v6y-evolution-helps',
        edit: '/v6y-evolution-helps/edit/:id',
        show: '/v6y-evolution-helps/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-audit-helps',
        list: '/v6y-audit-helps',
        edit: '/v6y-audit-helps/edit/:id',
        show: '/v6y-audit-helps/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-dependency-status-helps',
        list: '/v6y-dependency-status-helps',
        edit: '/v6y-dependency-status-helps/edit/:id',
        show: '/v6y-dependency-status-helps/show/:id',
        meta: {
            canDelete: true,
        },
    },
    {
        name: 'v6y-deprecated-dependencies',
        list: '/v6y-deprecated-dependencies',
        create: '/v6y-deprecated-dependencies/create',
        edit: '/v6y-deprecated-dependencies/edit/:id',
        show: '/v6y-deprecated-dependencies/show/:id',
        meta: {
            canDelete: true,
        },
    },
];

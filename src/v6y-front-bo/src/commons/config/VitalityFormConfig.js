import React from 'react';

import VitalityFormFieldSet from '../components/VitalityFormFieldSet.jsx';

export const applicationInfosFormItems = (translate) => {
    return [
        {
            id: 'app-name',
            name: 'app-name',
            label: translate('v6y-applications.fields.app-name.label'),
            placeholder: translate('v6y-applications.fields.app-name.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-applications.fields.app-name.error'),
                },
            ],
        },
        {
            id: 'app-acronym',
            name: 'app-acronym',
            label: translate('v6y-applications.fields.app-acronym.label'),
            placeholder: translate('v6y-applications.fields.app-acronym.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-applications.fields.app-acronym.error'),
                },
            ],
        },
        {
            id: 'app-contact-email',
            name: 'app-contact-email',
            label: translate('v6y-applications.fields.app-contact-email.label'),
            placeholder: translate('v6y-applications.fields.app-contact-email.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-applications.fields.app-contact-email.error'),
                },
                {
                    type: 'email',
                    message: translate('v6y-applications.fields.app-contact-email.error'),
                },
            ],
        },
        {
            id: 'app-description',
            name: 'app-description',
            label: translate('v6y-applications.fields.app-description.label'),
            placeholder: translate('v6y-applications.fields.app-description.placeholder'),
            type: 'textarea',
            rules: [
                {
                    required: true,
                    message: translate('v6y-applications.fields.app-description.error'),
                },
            ],
        },
    ];
};

export const applicationRequiredLinksFormItems = (translate) => [
    {
        id: 'app-git-web-url',
        name: 'app-git-web-url',
        label: translate('v6y-applications.fields.app-git-web-url.label'),
        placeholder: translate('v6y-applications.fields.app-git-web-url.placeholder'),
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-git-web-url.error'),
            },
        ],
    },
    {
        id: 'app-git-url',
        name: 'app-git-url',
        label: translate('v6y-applications.fields.app-git-url.label'),
        placeholder: translate('v6y-applications.fields.app-git-url.placeholder'),
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-git-url.error'),
            },
        ],
    },
    {
        id: 'app-production-link-1',
        name: `app-production-link-1`,
        label: translate('v6y-applications.fields.app-production-link.label'),
        placeholder: translate('v6y-applications.fields.app-production-link.placeholder'),
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-production-link.error'),
            },
        ],
    },
    {
        id: 'app-production-link-2',
        name: `app-production-link-2`,
        label: translate('v6y-applications.fields.app-production-link.label'),
        placeholder: translate('v6y-applications.fields.app-production-link.placeholder'),
        rules: [],
    },
    {
        id: 'app-production-link-3',
        name: `app-production-link-3`,
        label: translate('v6y-applications.fields.app-production-link.label'),
        placeholder: translate('v6y-applications.fields.app-production-link.placeholder'),
        rules: [],
    },
];

export const applicationOptionalLinksFormItems = (translate) => [
    {
        id: 'app-code-quality-platform-link',
        name: 'app-code-quality-platform-link',
        label: translate('v6y-applications.fields.app-code-quality-platform-link.label'),
        placeholder: translate(
            'v6y-applications.fields.app-code-quality-platform-link.placeholder',
        ),
        rules: [],
    },
    {
        id: 'app-ci-cd-platform-link',
        name: 'app-ci-cd-platform-link',
        label: translate('v6y-applications.fields.app-ci-cd-platform-link.label'),
        placeholder: translate('v6y-applications.fields.app-ci-cd-platform-link.placeholder'),
        rules: [],
    },
    {
        id: 'app-deployment-platform-link',
        name: 'app-deployment-platform-link',
        label: translate('v6y-applications.fields.app-deployment-platform-link.label'),
        placeholder: translate('v6y-applications.fields.app-deployment-platform-link.placeholder'),
        rules: [],
    },
];

export const applicationCreateEditItems = (translate) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-applications.fields.app-infos-group')}
            groupTitle={translate('v6y-applications.fields.app-infos-group')}
            items={applicationInfosFormItems(translate)}
        />,
        <VitalityFormFieldSet
            key={translate('v6y-applications.fields.app-required-link-group')}
            groupTitle={translate('v6y-applications.fields.app-required-link-group')}
            items={applicationRequiredLinksFormItems(translate)}
        />,
        <VitalityFormFieldSet
            key={translate('v6y-applications.fields.app-optional-link-group')}
            groupTitle={translate('v6y-applications.fields.app-optional-link-group')}
            items={applicationOptionalLinksFormItems(translate)}
        />,
    ];
};

export const applicationCreateOrEditFormInAdapter = (params) => ({
    appId: params?.['appId'],
    'app-acronym': params?.['acronym'],
    'app-name': params?.['name'],
    'app-description': params?.['description'],
    'app-git-web-url': params?.['repo']?.webUrl,
    'app-git-url': params?.['repo']?.gitUrl,
    'app-contact-email': params?.['contactMail'],
    'app-production-link-1': params?.['links']?.find?.(
        (item) => item.label === 'Application production url',
    )?.value,
    'app-code-quality-platform-link': params?.['links']?.find?.(
        (item) => item.label === 'Application code quality platform url',
    )?.value,
    'app-ci-cd-platform-link': params?.['links']?.find?.(
        (item) => item.label === 'Application CI/CD platform url',
    )?.value,
    'app-deployment-platform-link': params?.['links']?.find?.(
        (item) => item.label === 'Application deployment platform url',
    )?.value,
});

export const applicationCreateOrEditFormOutputAdapter = (params) => ({
    applicationInput: {
        acronym: params?.['app-acronym'],
        description: params?.['app-description'],
        gitWebUrl: params?.['app-git-web-url'],
        gitUrl: params?.['app-git-url'],
        name: params?.['app-name'],
        contactMail: params?.['app-contact-email'],
        productionLink: params?.['app-production-link-1'],
        appId: params?.['appId'],
        codeQualityPlatformLink: params?.['app-code-quality-platform-link'],
        ciPlatformLink: params?.['app-ci-cd-platform-link'],
        deploymentPlatformLink: params?.['app-deployment-platform-link'],
    },
});

export const faqInfosFormItems = (translate) => {
    return [
        {
            id: 'faq-title',
            name: 'faq-title',
            label: translate('v6y-faqs.fields.faq-title.label'),
            placeholder: translate('v6y-faqs.fields.faq-title.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-faqs.fields.faq-title.error'),
                },
            ],
        },
        {
            id: 'faq-description',
            name: 'faq-description',
            label: translate('v6y-faqs.fields.faq-description.label'),
            placeholder: translate('v6y-faqs.fields.faq-description.placeholder'),
            type: 'textarea',
            rules: [
                {
                    required: true,
                    message: translate('v6y-faqs.fields.faq-description.error'),
                },
            ],
        },
    ];
};

export const faqOptionalLinksFormItems = (translate) => [
    {
        id: 'faq-optional-link-1',
        name: 'faq-optional-link-1',
        label: translate('v6y-faqs.fields.faq-optional-link.label'),
        placeholder: translate('v6y-faqs.fields.faq-optional-link.placeholder'),
        rules: [],
    },
    {
        id: 'faq-optional-link-2',
        name: 'faq-optional-link-2',
        label: translate('v6y-faqs.fields.faq-optional-link.label'),
        placeholder: translate('v6y-faqs.fields.faq-optional-link.placeholder'),
        rules: [],
    },
    {
        id: 'faq-optional-link-3',
        name: 'faq-optional-link-3',
        label: translate('v6y-faqs.fields.faq-optional-link.label'),
        placeholder: translate('v6y-faqs.fields.faq-optional-link.placeholder'),
        rules: [],
    },
];

export const faqCreateEditItems = (translate) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-faqs.fields.faq-infos-group')}
            groupTitle={translate('v6y-faqs.fields.faq-infos-group')}
            items={faqInfosFormItems(translate)}
        />,
        <VitalityFormFieldSet
            key={translate('v6y-faqs.fields.faq-optional-link-group')}
            groupTitle={translate('v6y-faqs.fields.faq-optional-link-group')}
            items={faqOptionalLinksFormItems(translate)}
        />,
    ];
};

export const faqCreateOrEditFormInAdapter = (params) => ({
    faqId: params?.id,
    'faq-title': params?.['title'],
    'faq-description': params?.['description'],
    'faq-optional-link-1': params?.['links']?.[0]?.value,
    'faq-optional-link-2': params?.['links']?.[1]?.value,
    'faq-optional-link-3': params?.['links']?.[2]?.value,
});

export const faqCreateOrEditFormOutputAdapter = (params) => ({
    faqInput: {
        faqId: params?.['faqId'],
        title: params?.['faq-title'],
        description: params?.['faq-description'],
        links: [
            params?.['faq-optional-link-1'],
            params?.['faq-optional-link-2'],
            params?.['faq-optional-link-3'],
        ]?.filter((item) => item?.length),
    },
});

export const notificationCreateOrEditFormInAdapter = (params) => {
    console.log({ params });
    return {
        notificationId: params?.id,
        'notification-title': params?.['title'],
        'notification-description': params?.['description'],
        'notification-optional-link-1': params?.['links']?.[0]?.value,
        'notification-optional-link-2': params?.['links']?.[1]?.value,
        'notification-optional-link-3': params?.['links']?.[2]?.value,
    };
};

export const notificationCreateOrEditFormOutputAdapter = (params) => ({
    notificationInput: {
        notificationId: params?.['notificationId'],
        title: params?.['notification-title'],
        description: params?.['notification-description'],
        links: [
            params?.['notification-optional-link-1'],
            params?.['notification-optional-link-2'],
            params?.['notification-optional-link-3'],
        ]?.filter((item) => item?.length),
    },
});

export const notificationInfosFormItems = (translate) => {
    return [
        {
            id: 'notification-title',
            name: 'notification-title',
            label: translate('v6y-notifications.fields.notification-title.label'),
            placeholder: translate('v6y-notifications.fields.notification-title.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-notifications.fields.notification-title.error'),
                },
            ],
        },
        {
            id: 'notification-description',
            name: 'notification-description',
            label: translate('v6y-notifications.fields.notification-description.label'),
            placeholder: translate('v6y-notifications.fields.notification-description.placeholder'),
            type: 'textarea',
            rules: [
                {
                    required: true,
                    message: translate('v6y-notifications.fields.notification-description.error'),
                },
            ],
        },
    ];
};

export const notificationOptionalLinksFormItems = (translate) => [
    {
        id: 'notification-optional-link-1',
        name: 'notification-optional-link-1',
        label: translate('v6y-notifications.fields.notification-optional-link.label'),
        placeholder: translate('v6y-notifications.fields.notification-optional-link.placeholder'),
        rules: [],
    },
    {
        id: 'notification-optional-link-2',
        name: 'notification-optional-link-2',
        label: translate('v6y-notifications.fields.notification-optional-link.label'),
        placeholder: translate('v6y-notifications.fields.notification-optional-link.placeholder'),
        rules: [],
    },
    {
        id: 'notification-optional-link-3',
        name: 'notification-optional-link-3',
        label: translate('v6y-notifications.fields.notification-optional-link.label'),
        placeholder: translate('v6y-notifications.fields.notification-optional-link.placeholder'),
        rules: [],
    },
];

export const notificationCreateEditItems = (translate) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-notifications.fields.notification-infos-group')}
            groupTitle={translate('v6y-notifications.fields.notification-infos-group')}
            items={notificationInfosFormItems(translate)}
        />,
        <VitalityFormFieldSet
            key={translate('v6y-notifications.fields.notification-optional-link-group')}
            groupTitle={translate('v6y-notifications.fields.notification-optional-link-group')}
            items={notificationOptionalLinksFormItems(translate)}
        />,
    ];
};

export const evolutionHelpInfosFormItems = (translate) => {
    return [
        {
            id: 'evolution-help-category',
            name: 'evolution-help-category',
            label: translate('v6y-evolution-helps.fields.evolution-help-category.label'),
            disabled: true,
            rules: [],
        },
        {
            id: 'evolution-help-status',
            name: 'evolution-help-status',
            label: translate('v6y-evolution-helps.fields.evolution-help-status.label'),
            placeholder: translate('v6y-evolution-helps.fields.evolution-help-status.placeholder'),
            type: 'select',
            rules: [
                {
                    required: true,
                    message: translate('v6y-evolution-helps.fields.evolution-help-status.error'),
                },
            ],
        },
        {
            id: 'evolution-help-title',
            name: 'evolution-help-title',
            label: translate('v6y-evolution-helps.fields.evolution-help-title.label'),
            placeholder: translate('v6y-evolution-helps.fields.evolution-help-title.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-evolution-helps.fields.evolution-help-title.error'),
                },
            ],
        },
        {
            id: 'evolution-help-description',
            name: 'evolution-help-description',
            label: translate('v6y-evolution-helps.fields.evolution-help-description.label'),
            placeholder: translate(
                'v6y-evolution-helps.fields.evolution-help-description.placeholder',
            ),
            type: 'textarea',
            rules: [
                {
                    required: true,
                    message: translate(
                        'v6y-evolution-helps.fields.evolution-help-description.error',
                    ),
                },
            ],
        },
    ];
};

export const evolutionHelpOptionalLinksFormItems = (translate) => [
    {
        id: 'evolution-help-optional-link-1',
        name: 'evolution-help-optional-link-1',
        label: translate('v6y-evolution-helps.fields.evolution-help-link.label'),
        placeholder: translate('v6y-evolution-helps.fields.evolution-help-link.placeholder'),
        rules: [],
    },
    {
        id: 'evolution-help-optional-link-2',
        name: 'evolution-help-optional-link-2',
        label: translate('v6y-evolution-helps.fields.evolution-help-link.label'),
        placeholder: translate('v6y-evolution-helps.fields.evolution-help-link.placeholder'),
        rules: [],
    },
    {
        id: 'evolution-help-optional-link-3',
        name: 'evolution-help-optional-link-3',
        label: translate('v6y-evolution-helps.fields.evolution-help-link.label'),
        placeholder: translate('v6y-evolution-helps.fields.evolution-help-link.placeholder'),
        rules: [],
    },
];

export const evolutionHelpCreateEditItems = (translate, selectOptions) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-evolution-helps.fields.evolution-help-infos-group')}
            groupTitle={translate('v6y-evolution-helps.fields.evolution-help-infos-group')}
            items={evolutionHelpInfosFormItems(translate)}
            selectOptions={selectOptions}
        />,
        <VitalityFormFieldSet
            key={translate('v6y-evolution-helps.fields.evolution-help-optional-link-group')}
            groupTitle={translate('v6y-evolution-helps.fields.evolution-help-optional-link-group')}
            items={evolutionHelpOptionalLinksFormItems(translate)}
        />,
    ];
};

export const evolutionHelpCreateOrEditFormInAdapter = (params) => ({
    evolutionHelpId: params?.id,
    'evolution-help-category': params?.['category'],
    'evolution-help-status': params?.['status'],
    'evolution-help-title': params?.['title'],
    'evolution-help-description': params?.['description'],
    'evolution-help-optional-link-1': params?.['links']?.[0]?.value,
    'evolution-help-optional-link-2': params?.['links']?.[1]?.value,
    'evolution-help-optional-link-3': params?.['links']?.[2]?.value,
});

export const evolutionHelpCreateOrEditFormOutputAdapter = (params) => {
    console.log({ params });

    return {
        evolutionHelpInput: {
            evolutionHelpId: params?.['evolutionHelpId'],
            category: params?.['evolution-help-category'],
            status: params?.['evolution-help-status'],
            title: params?.['evolution-help-title'],
            description: params?.['evolution-help-description'],
            links: [
                params?.['evolution-help-optional-link-1'],
                params?.['evolution-help-optional-link-2'],
                params?.['evolution-help-optional-link-3'],
            ]?.filter((item) => item?.length),
        },
    };
};

export const auditHelpInfosFormItems = (translate) => {
    return [
        {
            id: 'audit-help-category',
            name: 'audit-help-category',
            label: translate('v6y-audit-helps.fields.audit-help-category.label'),
            disabled: true,
            rules: [],
        },
        {
            id: 'audit-help-title',
            name: 'audit-help-title',
            label: translate('v6y-audit-helps.fields.audit-help-title.label'),
            placeholder: translate('v6y-audit-helps.fields.audit-help-title.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-audit-helps.fields.audit-help-title.error'),
                },
            ],
        },
        {
            id: 'audit-help-description',
            name: 'audit-help-description',
            label: translate('v6y-audit-helps.fields.audit-help-description.label'),
            placeholder: translate('v6y-audit-helps.fields.audit-help-description.placeholder'),
            type: 'textarea',
            rules: [
                {
                    required: true,
                    message: translate('v6y-audit-helps.fields.audit-help-description.error'),
                },
            ],
        },
        {
            id: 'audit-help-explanation',
            name: 'audit-help-explanation',
            label: translate('v6y-audit-helps.fields.audit-help-explanation.label'),
            placeholder: translate('v6y-audit-helps.fields.audit-help-explanation.placeholder'),
            rules: [
                {
                    required: true,
                    message: translate('v6y-audit-helps.fields.audit-help-explanation.error'),
                },
            ],
        },
    ];
};

export const auditHelpCreateEditItems = (translate) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-audit-helps.fields.audit-help-infos-group')}
            groupTitle={translate('v6y-audit-helps.fields.audit-help-infos-group')}
            items={auditHelpInfosFormItems(translate)}
        />,
    ];
};

export const auditHelpCreateOrEditFormInAdapter = (params) => ({
    auditHelpId: params?.id,
    'audit-help-category': params?.['category'],
    'audit-help-title': params?.['title'],
    'audit-help-description': params?.['description'],
    'audit-help-explanation': params?.['explanation'],
});

export const auditHelpCreateOrEditFormOutputAdapter = (params) => ({
    auditHelpInput: {
        auditHelpId: params?.['auditHelpId'],
        category: params?.['audit-help-category'],
        title: params?.['audit-help-title'],
        description: params?.['audit-help-description'],
        explanation: params?.['audit-help-explanation'],
    },
});

export const dependencyStatusHelpInfosFormItems = (translate) => {
    return [
        {
            id: 'dependency-status-help-category',
            name: 'dependency-status-help-category',
            label: translate(
                'v6y-dependency-status-helps.fields.dependency-status-help-category.label',
            ),
            disabled: true,
            rules: [],
        },
        {
            id: 'dependency-status-help-title',
            name: 'dependency-status-help-title',
            label: translate(
                'v6y-dependency-status-helps.fields.dependency-status-help-title.label',
            ),
            placeholder: translate(
                'v6y-dependency-status-helps.fields.dependency-status-help-title.placeholder',
            ),
            rules: [
                {
                    required: true,
                    message: translate(
                        'v6y-dependency-status-helps.fields.dependency-status-help-title.error',
                    ),
                },
            ],
        },
        {
            id: 'dependency-status-help-description',
            name: 'dependency-status-help-description',
            label: translate(
                'v6y-dependency-status-helps.fields.dependency-status-help-description.label',
            ),
            placeholder: translate(
                'v6y-dependency-status-helps.fields.dependency-status-help-description.placeholder',
            ),
            type: 'textarea',
            rules: [
                {
                    required: true,
                    message: translate(
                        'v6y-dependency-status-helps.fields.dependency-status-help-description.error',
                    ),
                },
            ],
        },
    ];
};

export const dependencyStatusHelpCreateEditItems = (translate) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-dependency-status-helps.fields.dependency-status-help-infos-group')}
            groupTitle={translate(
                'v6y-dependency-status-helps.fields.dependency-status-help-infos-group',
            )}
            items={dependencyStatusHelpInfosFormItems(translate)}
        />,
    ];
};

export const dependencyStatusHelpCreateOrEditFormInAdapter = (params) => ({
    dependencyStatusHelpId: params?.id,
    'dependency-status-help-category': params?.['category'],
    'dependency-status-help-title': params?.['title'],
    'dependency-status-help-description': params?.['description'],
});

export const dependencyStatusHelpCreateOrEditFormOutputAdapter = (params) => ({
    dependencyStatusHelpInput: {
        dependencyStatusHelpId: params?.['dependencyStatusHelpId'],
        category: params?.['dependency-status-help-category'],
        title: params?.['dependency-status-help-title'],
        description: params?.['dependency-status-help-description'],
    },
});

export const deprecatedDependencyInfosFormItems = (translate) => {
    return [
        {
            id: 'deprecated-dependency-name',
            name: 'deprecated-dependency-name',
            label: translate('v6y-deprecated-dependencies.fields.deprecated-dependency-name.label'),
            placeholder: translate(
                'v6y-deprecated-dependencies.fields.deprecated-dependency-name.placeholder',
            ),
            rules: [
                {
                    required: true,
                    message: translate(
                        'v6y-deprecated-dependencies.fields.deprecated-dependency-name.error',
                    ),
                },
            ],
        },
    ];
};

export const deprecatedDependencyCreateEditItems = (translate) => {
    return [
        <VitalityFormFieldSet
            key={translate('v6y-deprecated-dependencies.fields.deprecated-dependency-infos-group')}
            groupTitle={translate(
                'v6y-deprecated-dependencies.fields.deprecated-dependency-infos-group',
            )}
            items={deprecatedDependencyInfosFormItems(translate)}
        />,
    ];
};

export const deprecatedDependencyCreateOrEditFormInAdapter = (params) => ({
    deprecatedDependencyId: params?.id,
    'deprecated-dependency-name': params?.['name'],
});

export const deprecatedDependencyCreateOrEditFormOutputAdapter = (params) => ({
    deprecatedDependencyInput: {
        deprecatedDependencyId: params?.['deprecatedDependencyId'],
        name: params?.['deprecated-dependency-name'],
    },
});

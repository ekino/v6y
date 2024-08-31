import React from 'react';

import VitalityEvolutionHelpEditView from '../../features/v6y-evolution-helps/components/VitalityEvolutionHelpEditView.jsx';
import VitalityInputFieldSet from '../components/VitalityInputFieldSet.jsx';

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
        <VitalityInputFieldSet
            key={translate('v6y-applications.fields.app-infos-group')}
            groupTitle={translate('v6y-applications.fields.app-infos-group')}
            items={applicationInfosFormItems(translate)}
        />,
        <VitalityInputFieldSet
            key={translate('v6y-applications.fields.app-required-link-group')}
            groupTitle={translate('v6y-applications.fields.app-required-link-group')}
            items={applicationRequiredLinksFormItems(translate)}
        />,
        <VitalityInputFieldSet
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
        appId: params?.['appId'] || '12345',
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
        <VitalityInputFieldSet
            key={translate('v6y-faqs.fields.faq-infos-group')}
            groupTitle={translate('v6y-faqs.fields.faq-infos-group')}
            items={faqInfosFormItems(translate)}
        />,
        <VitalityInputFieldSet
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
        <VitalityInputFieldSet
            key={translate('v6y-notifications.fields.notification-infos-group')}
            groupTitle={translate('v6y-notifications.fields.notification-infos-group')}
            items={notificationInfosFormItems(translate)}
        />,
        <VitalityInputFieldSet
            key={translate('v6y-notifications.fields.notification-optional-link-group')}
            groupTitle={translate('v6y-notifications.fields.notification-optional-link-group')}
            items={notificationOptionalLinksFormItems(translate)}
        />,
    ];
};

export const evolutionHelpCreateEditItems = (translate) => {
    return [
        <VitalityInputFieldSet
            key={translate('v6y-faqs.fields.faq-infos-group')}
            groupTitle={translate('v6y-faqs.fields.faq-infos-group')}
            items={faqInfosFormItems(translate)}
        />,
        <VitalityInputFieldSet
            key={translate('v6y-faqs.fields.faq-optional-link-group')}
            groupTitle={translate('v6y-faqs.fields.faq-optional-link-group')}
            items={faqOptionalLinksFormItems(translate)}
        />,
    ];
};

export const evolutionHelpCreateOrEditFormInAdapter = (params) => ({
    faqId: params?.id,
    'faq-title': params?.['title'],
    'faq-description': params?.['description'],
    'faq-optional-link-1': params?.['links']?.[0]?.value,
    'faq-optional-link-2': params?.['links']?.[1]?.value,
    'faq-optional-link-3': params?.['links']?.[2]?.value,
});

export const evolutionHelpCreateOrEditFormOutputAdapter = (params) => ({
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

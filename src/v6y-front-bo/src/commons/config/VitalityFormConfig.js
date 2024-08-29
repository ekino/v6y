import React from 'react';

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

export const createOrEditFormOutputAdapter = (params) => ({
    applicationInput: {
        acronym: params?.['app-acronym'],
        description: params?.['app-description'],
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

export const createOrEditFormInAdapter = (params) => ({
    appId: params?.['appId'],
    'app-acronym': params?.['acronym'],
    'app-name': params?.['name'],
    'app-description': params?.['description'],
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

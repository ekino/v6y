export const applicationInfosFormItems = (translate, application = {}) => [
    {
        id: 'app-name',
        name: 'app-name',
        label: translate('v6y-applications.fields.app-name.label'),
        placeholder: translate('v6y-applications.fields.app-name.placeholder'),
        initialValue: application.name,
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
        initialValue: application.acronym,
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-acronym.error'),
            },
        ],
    },
    {
        id: 'app-description',
        name: 'app-description',
        label: translate('v6y-applications.fields.app-description.label'),
        placeholder: translate('v6y-applications.fields.app-description.placeholder'),
        initialValue: application.description,
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-description.error'),
            },
        ],
    },
];

export const applicationRequiredLinksFormItems = (translate, application = {}) => [
    {
        id: 'app-git-url',
        name: 'app-git-url',
        label: translate('v6y-applications.fields.app-git-url.label'),
        placeholder: translate('v6y-applications.fields.app-git-url.placeholder'),
        initialValue: application['app-git-url'],
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-git-url.error'),
            },
        ],
    },
    {
        id: 'app-required-link-1',
        name: `app-production-link-1`,
        label: translate('v6y-applications.fields.app-production-link.label'),
        placeholder: translate('v6y-applications.fields.app-production-link.placeholder'),
        initialValue: application['app-production-link-1'],
        rules: [
            {
                required: true,
                message: translate('v6y-applications.fields.app-production-link.error'),
            },
        ],
    },
    {
        id: 'app-required-link-2',
        name: `app-production-link-2`,
        label: translate('v6y-applications.fields.app-production-link.label'),
        placeholder: translate('v6y-applications.fields.app-production-link.placeholder'),
        initialValue: application['app-production-link-2'],
        rules: [],
    },
    {
        id: 'app-required-link-3',
        name: `app-production-link-3`,
        label: translate('v6y-applications.fields.app-production-link.label'),
        placeholder: translate('v6y-applications.fields.app-production-link.placeholder'),
        initialValue: application['app-production-link-3'],
        rules: [],
    },
];

export const applicationOptionalLinksFormItems = (translate, application = {}) => [
    {
        id: 'app-code-quality-platform-link',
        name: 'app-code-quality-platform-link',
        label: translate('v6y-applications.fields.app-code-quality-platform-link.label'),
        placeholder: translate(
            'v6y-applications.fields.app-code-quality-platform-link.placeholder',
        ),
        initialValue: application['app-code-quality-platform-link'],
        rules: [],
    },
    {
        id: 'app-ci-cd-platform-link',
        name: 'app-ci-cd-platform-link',
        label: translate('v6y-applications.fields.app-ci-cd-platform-link.label'),
        placeholder: translate('v6y-applications.fields.app-ci-cd-platform-link.placeholder'),
        initialValue: application['app-ci-cd-platform-link'],
        rules: [],
    },
    {
        id: 'app-deployment-platform-link',
        name: 'app-deployment-platform-link',
        label: translate('v6y-applications.fields.app-deployment-platform-link.label'),
        placeholder: translate('v6y-applications.fields.app-deployment-platform-link.placeholder'),
        initialValue: application['app-deployment-platform-link'],
        rules: [],
    },
];

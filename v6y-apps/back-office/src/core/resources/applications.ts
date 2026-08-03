import type { ResourceConfig } from './types.ts';

const applications: ResourceConfig = {
    name: 'v6y-applications',
    label: 'Applications',
    canCreate: true,
    canDelete: true,
    fields: [
        { name: 'acronym', label: 'Acronym', type: 'text', required: true },
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'contactMail', label: 'Contact email', type: 'text', required: true },
        { name: 'gitOrganization', label: 'Git organization', type: 'text' },
        { name: 'gitWebUrl', label: 'Git web url', type: 'text', required: true },
        { name: 'gitUrl', label: 'Git url', type: 'text', required: true },
        { name: 'productionLink', label: 'Production url', type: 'text', required: true },
        { name: 'dataDogApiKey', label: 'DataDog API key', type: 'text', hideInList: true },
        { name: 'dataDogAppKey', label: 'DataDog app key', type: 'text', hideInList: true },
        { name: 'dataDogUrl', label: 'DataDog url', type: 'text', hideInList: true },
        { name: 'dataDogMonitorId', label: 'DataDog monitor id', type: 'text', hideInList: true },
        { name: 'sonarqubeLink', label: 'SonarQube url', type: 'text', hideInList: true },
        {
            name: 'sonarqubeToken',
            label: 'SonarQube API token',
            type: 'password',
            hideInList: true,
            hideInShow: true,
        },
        {
            name: 'codeQualityPlatformLink',
            label: 'Code quality platform url',
            type: 'text',
            hideInList: true,
        },
        { name: 'ciPlatformLink', label: 'CI/CD platform url', type: 'text', hideInList: true },
        {
            name: 'deploymentPlatformLink',
            label: 'Deployment platform url',
            type: 'text',
            hideInList: true,
        },
        {
            name: 'auditFrequencyEnabled',
            label: 'Recurring audit enabled',
            type: 'boolean',
            hideInList: true,
        },
        {
            name: 'auditFrequencyCron',
            label: 'Audit frequency (cron expression)',
            type: 'text',
            hideInList: true,
        },
        { name: 'links', label: 'Extra links', type: 'links', hideInList: true },
    ],
    graphql: {
        // Shared with the accounts feature (application picker) in the old front-bo app.
        listQuery: `
            query GetApplicationListByPageAndParams($sort: String) {
                getApplicationListByPageAndParams(sort: $sort) {
                    _id
                    acronym
                    name
                    description
                }
            }
        `,
        listField: 'getApplicationListByPageAndParams',
        listSupportsSort: true,
        // Note: the detail query resolver field name (getApplicationDetailsInfoByParams)
        // is NOT the usual get{X}DetailsByParams pattern used by the other 7 resources.
        detailQuery: `
            query GetApplicationDetails($_id: Int!) {
                getApplicationDetailsInfoByParams(_id: $_id) {
                    _id
                    name
                    acronym
                    contactMail
                    description
                    links {
                        label
                        value
                        description
                    }
                    repo {
                        organization
                        webUrl
                        gitUrl
                    }
                    configuration {
                        dataDog {
                            apiKey
                            appKey
                            monitorId
                            url
                        }
                        sonarqube {
                            token
                        }
                    }
                    auditFrequencyEnabled
                    auditFrequencyCron
                }
            }
        `,
        detailField: 'getApplicationDetailsInfoByParams',
        // Note: the mutation argument name is "applicationInput", not "input".
        createOrEditMutation: `
            mutation CreateOrEditApplication($applicationInput: ApplicationCreateOrEditInput!) {
                createOrEditApplication(applicationInput: $applicationInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditApplication',
        createOrEditArgName: 'applicationInput',
        deleteMutation: `
            mutation DeleteApplication($input: ApplicationDeleteInput!) {
                deleteApplication(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteApplication',
    },
};

export default applications;

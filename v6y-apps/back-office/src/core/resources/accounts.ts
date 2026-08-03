import type { ResourceConfig } from './types.ts';

const accounts: ResourceConfig = {
    name: 'v6y-accounts',
    label: 'Accounts',
    canCreate: true,
    canDelete: true,
    fields: [
        { name: 'username', label: 'Username', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            required: true,
            options: [
                { label: 'User', value: 'USER' },
                { label: 'Admin', value: 'ADMIN' },
                { label: 'Super admin', value: 'SUPERADMIN' },
            ],
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            hideInList: true,
            hideInShow: true,
        },
        {
            name: 'applications',
            label: 'Application ids (comma-separated)',
            type: 'text',
            hideInList: true,
        },
    ],
    graphql: {
        listQuery: `
            query GetAccountListByPageAndParams {
                getAccountListByPageAndParams {
                    _id
                    username
                    email
                    role
                }
            }
        `,
        listField: 'getAccountListByPageAndParams',
        detailQuery: `
            query GetAccountDetailsByParams($_id: Int!) {
                getAccountDetailsByParams(_id: $_id) {
                    _id
                    username
                    email
                    role
                    applications
                }
            }
        `,
        detailField: 'getAccountDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditAccount($accountInput: AccountCreateOrEditInput!) {
                createOrEditAccount(input: $accountInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditAccount',
        createOrEditArgName: 'accountInput',
        deleteMutation: `
            mutation DeleteAccount($input: AccountDeleteInput!) {
                deleteAccount(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteAccount',
    },
};

export default accounts;

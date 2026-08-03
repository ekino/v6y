import type { ResourceConfig } from './types.ts';

const deprecatedDependencies: ResourceConfig = {
    name: 'v6y-deprecated-dependencies',
    label: 'Deprecated dependencies',
    canCreate: true,
    canDelete: true,
    fields: [{ name: 'name', label: 'Name', type: 'text', required: true }],
    graphql: {
        listQuery: `
            query GetDeprecatedDependencyListByPageAndParams($start: Int, $limit: Int, $sort: String) {
                getDeprecatedDependencyListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
                    _id
                    name
                }
            }
        `,
        listField: 'getDeprecatedDependencyListByPageAndParams',
        listSupportsPagination: true,
        listSupportsSort: true,
        detailQuery: `
            query GetDeprecatedDependencyDetailsByParams($_id: Int!) {
                getDeprecatedDependencyDetailsByParams(_id: $_id) {
                    _id
                    name
                }
            }
        `,
        detailField: 'getDeprecatedDependencyDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditDeprecatedDependency(
                $deprecatedDependencyInput: DeprecatedDependencyCreateOrEditInput!
            ) {
                createOrEditDeprecatedDependency(deprecatedDependencyInput: $deprecatedDependencyInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditDeprecatedDependency',
        createOrEditArgName: 'deprecatedDependencyInput',
        deleteMutation: `
            mutation DeleteDeprecatedDependency($input: DeprecatedDependencyDeleteInput!) {
                deleteDeprecatedDependency(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteDeprecatedDependency',
    },
};

export default deprecatedDependencies;

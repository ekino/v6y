import type { ResourceConfig } from './types.ts';

// No create route: DependencyStatusHelpCreateOrEditInput._id is a required Int!,
// meaning this resource is always edited, never created, from the admin.
const dependencyStatusHelps: ResourceConfig = {
    name: 'v6y-dependency-status-helps',
    label: 'Dependency status helps',
    canCreate: false,
    canDelete: true,
    fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'links', label: 'Extra links', type: 'links', hideInList: true },
    ],
    graphql: {
        listQuery: `
            query GetDependencyStatusHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
                getDependencyStatusHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
                    _id
                    title
                    description
                    category
                }
            }
        `,
        listField: 'getDependencyStatusHelpListByPageAndParams',
        listSupportsPagination: true,
        listSupportsSort: true,
        detailQuery: `
            query GetDependencyStatusHelpDetailsByParams($_id: Int!) {
                getDependencyStatusHelpDetailsByParams(_id: $_id) {
                    _id
                    title
                    category
                    description
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        detailField: 'getDependencyStatusHelpDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditDependencyStatusHelp(
                $dependencyStatusHelpInput: DependencyStatusHelpCreateOrEditInput!
            ) {
                createOrEditDependencyStatusHelp(dependencyStatusHelpInput: $dependencyStatusHelpInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditDependencyStatusHelp',
        createOrEditArgName: 'dependencyStatusHelpInput',
        deleteMutation: `
            mutation DeleteDependencyStatusHelp($input: DependencyStatusHelpDeleteInput!) {
                deleteDependencyStatusHelp(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteDependencyStatusHelp',
    },
};

export default dependencyStatusHelps;

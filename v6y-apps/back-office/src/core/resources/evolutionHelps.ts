import type { ResourceConfig } from './types.ts';

// No create route: EvolutionHelpCreateOrEditInput._id is a required Int!,
// meaning this resource is always edited, never created, from the admin.
const evolutionHelps: ResourceConfig = {
    name: 'v6y-evolution-helps',
    label: 'Evolution helps',
    canCreate: false,
    canDelete: true,
    fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
        {
            name: 'status',
            label: 'Status',
            type: 'text',
            required: true,
        },
        { name: 'links', label: 'Extra links', type: 'links', hideInList: true },
    ],
    graphql: {
        listQuery: `
            query GetEvolutionHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
                getEvolutionHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
                    _id
                    title
                    description
                    category
                    status
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        listField: 'getEvolutionHelpListByPageAndParams',
        listSupportsPagination: true,
        listSupportsSort: true,
        detailQuery: `
            query GetEvolutionHelpDetailsByParams($_id: Int!) {
                getEvolutionHelpDetailsByParams(_id: $_id) {
                    _id
                    title
                    description
                    category
                    status
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        detailField: 'getEvolutionHelpDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditEvolutionHelp($evolutionHelpInput: EvolutionHelpCreateOrEditInput!) {
                createOrEditEvolutionHelp(evolutionHelpInput: $evolutionHelpInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditEvolutionHelp',
        createOrEditArgName: 'evolutionHelpInput',
        deleteMutation: `
            mutation DeleteEvolutionHelp($input: EvolutionHelpDeleteInput!) {
                deleteEvolutionHelp(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteEvolutionHelp',
    },
};

export default evolutionHelps;

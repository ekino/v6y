import type { ResourceConfig } from './types.ts';

// No create route: AuditHelpCreateOrEditInput._id is a required Int!,
// meaning this resource is always edited, never created, from the admin.
const auditHelps: ResourceConfig = {
    name: 'v6y-audit-helps',
    label: 'Audit helps',
    canCreate: false,
    canDelete: true,
    fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'category', label: 'Category', type: 'text', required: true },
        { name: 'explanation', label: 'Explanation', type: 'textarea' },
    ],
    graphql: {
        listQuery: `
            query GetAuditHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
                getAuditHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
                    _id
                    title
                    description
                    category
                    explanation
                }
            }
        `,
        listField: 'getAuditHelpListByPageAndParams',
        listSupportsPagination: true,
        listSupportsSort: true,
        detailQuery: `
            query GetAuditHelpDetailsByParams($_id: Int!) {
                getAuditHelpDetailsByParams(_id: $_id) {
                    _id
                    title
                    description
                    category
                    explanation
                }
            }
        `,
        detailField: 'getAuditHelpDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditAuditHelp($auditHelpInput: AuditHelpCreateOrEditInput!) {
                createOrEditAuditHelp(auditHelpInput: $auditHelpInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditAuditHelp',
        createOrEditArgName: 'auditHelpInput',
        deleteMutation: `
            mutation DeleteAuditHelp($input: AuditHelpDeleteInput!) {
                deleteAuditHelp(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteAuditHelp',
    },
};

export default auditHelps;

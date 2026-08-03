import type { ResourceConfig } from './types.ts';

const faqs: ResourceConfig = {
    name: 'v6y-faqs',
    label: 'FAQs',
    canCreate: true,
    canDelete: true,
    fields: [
        { name: 'title', label: 'Question', type: 'text', required: true },
        { name: 'description', label: 'Answer', type: 'textarea', required: true },
        { name: 'links', label: 'Extra links', type: 'links', hideInList: true },
    ],
    graphql: {
        listQuery: `
            query GetFaqListByPageAndParams($start: Int, $limit: Int, $sort: String) {
                getFaqListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
                    _id
                    title
                    description
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        listField: 'getFaqListByPageAndParams',
        listSupportsPagination: true,
        listSupportsSort: true,
        detailQuery: `
            query GetFaqDetailsByParams($_id: Int!) {
                getFaqDetailsByParams(_id: $_id) {
                    _id
                    title
                    description
                    links {
                        label
                        value
                        description
                    }
                }
            }
        `,
        detailField: 'getFaqDetailsByParams',
        createOrEditMutation: `
            mutation CreateOrEditFaq($faqInput: FaqCreateOrEditInput!) {
                createOrEditFaq(faqInput: $faqInput) {
                    _id
                }
            }
        `,
        createOrEditField: 'createOrEditFaq',
        createOrEditArgName: 'faqInput',
        deleteMutation: `
            mutation DeleteFaq($input: FaqDeleteInput!) {
                deleteFaq(input: $input) {
                    _id
                }
            }
        `,
        deleteField: 'deleteFaq',
    },
};

export default faqs;

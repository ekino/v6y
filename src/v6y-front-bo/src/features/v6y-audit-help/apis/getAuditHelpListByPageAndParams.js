import { gql } from 'graphql-request';

const GetAuditHelpListByPageAndParams = gql`
    query GetAuditHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getAuditHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            id: _id
            title
            description
            category
            explanation
        }
    }
`;

export default GetAuditHelpListByPageAndParams;

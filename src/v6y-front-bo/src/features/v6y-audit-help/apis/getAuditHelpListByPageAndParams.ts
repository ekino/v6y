import { gql } from 'graphql-request';

const GetAuditHelpListByPageAndParams = gql`
    query GetAuditHelpListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getAuditHelpListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            _id
            title
            description
            category
            explanation
        }
    }
`;

export default GetAuditHelpListByPageAndParams;

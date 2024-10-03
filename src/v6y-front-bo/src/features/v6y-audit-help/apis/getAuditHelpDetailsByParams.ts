import { gql } from 'graphql-request';

const GetAuditHelpDetailsByParams = gql`
    query GetAuditHelpDetailsByParams($_id: Int!) {
        getAuditHelpDetailsByParams(_id: $_id) {
            _id
            title
            description
            category
            explanation
        }
    }
`;

export default GetAuditHelpDetailsByParams;

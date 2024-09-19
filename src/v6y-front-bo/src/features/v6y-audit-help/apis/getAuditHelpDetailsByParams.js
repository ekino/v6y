import { gql } from 'graphql-request';

const GetAuditHelpDetailsByParams = gql`
    query GetAuditHelpDetailsByParams($auditHelpId: String!) {
        getAuditHelpDetailsByParams(auditHelpId: $auditHelpId) {
            id: _id
            title
            description
            category
            explanation
        }
    }
`;

export default GetAuditHelpDetailsByParams;

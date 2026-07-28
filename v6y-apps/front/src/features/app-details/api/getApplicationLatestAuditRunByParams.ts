import { gql } from 'graphql-request';

const GetApplicationLatestAuditRunByParams = gql`
    query getApplicationLatestAuditRunByParams($_id: Int!) {
        getApplicationLatestAuditRunByParams(_id: $_id) {
            _id
            runStatus
            triggeredAt
            completedAt
            errorMessage
        }
    }
`;

export default GetApplicationLatestAuditRunByParams;

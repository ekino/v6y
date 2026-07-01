import { gql } from 'graphql-request';

const GetApplicationAuditRuns = gql`
    query getApplicationAuditRunsByParams($_id: Int!) {
        getApplicationAuditRunsByParams(_id: $_id) {
            _id
            appId
            branch
            runStatus
            analysisTypes
            triggeredAt
            completedAt
            errorMessage
            audits {
                _id
                type
                category
            }
        }
    }
`;

export default GetApplicationAuditRuns;

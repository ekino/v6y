import { gql } from 'graphql-request';

const GetAllAuditRuns = gql`
    query getAllAuditRuns {
        getAllAuditRuns {
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

export default GetAllAuditRuns;

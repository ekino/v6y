import { gql } from 'graphql-request';

const GetApplicationAuditResultsQuery = gql`
    query getApplicationAuditResults($applicationId: Int!, $branch: String) {
        getApplicationAuditResults(applicationId: $applicationId, branch: $branch) {
            _id
            type
            category
            subCategory
            auditStatus
            scoreStatus
            score
            scoreUnit
            extraInfos
            module {
                branch
                path
                url
            }
        }
    }
`;

export default GetApplicationAuditResultsQuery;

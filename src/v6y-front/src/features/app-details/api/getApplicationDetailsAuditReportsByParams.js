import { gql } from 'graphql-request';

const GetApplicationDetailsAuditReportsByParams = gql`
    query getApplicationDetailsAuditReportsByParams($appId: String!) {
        getApplicationDetailsAuditReportsByParams(appId: $appId) {
            _id
            type
            category
            subCategory
            status
            score
            scorePercent
            scoreUnit
            module {
                branch
                path
                url
            }
            auditHelp {
                category
                title
                description
                explanation
            }
        }
    }
`;

export default GetApplicationDetailsAuditReportsByParams;

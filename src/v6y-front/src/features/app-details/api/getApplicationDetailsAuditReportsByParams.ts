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
            scoreUnit
            extraInfos
            auditHelp {
                _id
                category
                title
                description
                explanation
            }
            module {
                branch
                path
                url
            }
        }
    }
`;

export default GetApplicationDetailsAuditReportsByParams;

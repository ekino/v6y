import { gql } from 'graphql-request';

const GetAppDetailsAuditReportsByParams = gql`
    query getAppDetailsAuditReportsByParams($appId: String) {
        getAppDetailsAuditReportsByParams(appId: $appId) {
            type
            category
            subCategory
            title
            description
            explanation
            webUrl
            status
            score
            scorePercent
            scoreUnit
            branch
            module
        }
    }
`;

export default GetAppDetailsAuditReportsByParams;

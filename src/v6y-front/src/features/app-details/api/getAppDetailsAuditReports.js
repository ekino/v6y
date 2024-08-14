import { gql } from 'graphql-request';

const GetAppDetailsAuditReports = gql`
    query getAppDetails($appId: String) {
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

export default GetAppDetailsAuditReports;

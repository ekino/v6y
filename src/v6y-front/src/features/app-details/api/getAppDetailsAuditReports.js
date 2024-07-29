import { gql } from 'graphql-request';

const GetAppDetailsAuditReports = gql`
    query getAppDetailsAuditReports($appId: String) {
        getAppDetailsAuditReports(appId: $appId) {
            type
            category
            subCategory
            title
            description
            webUrl
            status
            score
            scoreMax
            scoreMin
            scorePercent
            scoreUnit
            branch
        }
    }
`;

export default GetAppDetailsAuditReports;

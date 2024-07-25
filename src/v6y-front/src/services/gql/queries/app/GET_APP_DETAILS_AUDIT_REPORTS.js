import { gql } from 'graphql-request';

const GET_APP_DETAILS_AUDIT_REPORTS = gql`
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

export default GET_APP_DETAILS_AUDIT_REPORTS;

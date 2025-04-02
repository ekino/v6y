import { gql } from 'graphql-request';

const GetApplicationDetailsAuditReportsByParams = gql`
    query getApplicationDetailsAuditReportsByParams($_id: Int!) {
        getApplicationDetailsAuditReportsByParams(_id: $_id) {
            _id
            type
            category
            subCategory
            auditStatus
            scoreStatus
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

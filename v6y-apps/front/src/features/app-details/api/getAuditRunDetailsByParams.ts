import { gql } from 'graphql-request';

const GetAuditRunDetailsByParams = gql`
    query getAuditRunDetailsByParams($_id: Int!) {
        getAuditRunDetailsByParams(_id: $_id) {
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
                subCategory
                auditStatus
                scoreStatus
                score
                scoreUnit
                extraInfos
                dateStart
                dateEnd
                module {
                    branch
                    path
                    url
                }
            }
        }
    }
`;

export default GetAuditRunDetailsByParams;

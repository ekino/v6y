import { gql } from 'graphql-request';

const GetAppDetailsQualityReports = gql`
    query getAppDetails($appId: String) {
        getAppDetailsQualityReports: getAppDetailsByParams(appId: $appId) {
            keywords {
                type
                branch
                label
                status
            }
            qualityGates {
                label
                branch
                status
                module
            }
        }
    }
`;

export default GetAppDetailsQualityReports;

import { gql } from 'graphql-request';

const GetAppDetailsQualityReports = gql`
    query getAppDetails($appId: String) {
        getAppDetailsQualityReports: getAppDetailsByParams(appId: $appId) {
            keywords {
                type
                branch
                label
                color
            }
            qualityGates {
                label
                branch
                level
                color
                module
            }
        }
    }
`;

export default GetAppDetailsQualityReports;

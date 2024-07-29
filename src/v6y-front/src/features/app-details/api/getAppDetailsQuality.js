import { gql } from 'graphql-request';

const GetAppDetailsQuality = gql`
    query getAppDetails($appId: String) {
        getAppDetailsQuality: getAppDetails(appId: $appId) {
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

export default GetAppDetailsQuality;

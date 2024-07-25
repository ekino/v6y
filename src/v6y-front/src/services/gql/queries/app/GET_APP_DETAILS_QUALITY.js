/* eslint-disable max-len */
import { gql } from 'graphql-request';

const GET_APP_DETAILS_QUALITY = gql`
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

export default GET_APP_DETAILS_QUALITY;

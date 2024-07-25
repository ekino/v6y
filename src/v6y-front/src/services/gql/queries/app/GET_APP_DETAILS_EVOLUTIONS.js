/* eslint-disable max-len */
import { gql } from 'graphql-request';

const GET_APP_DETAILS_EVOLUTIONS = gql`
    query getAppDetails($appId: String) {
        getAppDetailsEvolutions: getAppDetails(appId: $appId) {
            evolutions {
                type
                branch
                title
                description
                docLinks {
                    type
                    label
                    description
                    value
                }
            }
        }
    }
`;

export default GET_APP_DETAILS_EVOLUTIONS;

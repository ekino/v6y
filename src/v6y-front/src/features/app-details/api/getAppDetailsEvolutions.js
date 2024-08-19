import { gql } from 'graphql-request';

const GetAppDetailsEvolutions = gql`
    query getAppDetails($appId: String) {
        getAppDetailsEvolutions: getAppDetailsByParams(appId: $appId) {
            evolutions {
                _id
                type
                branch
                title
                description
                status
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

export default GetAppDetailsEvolutions;

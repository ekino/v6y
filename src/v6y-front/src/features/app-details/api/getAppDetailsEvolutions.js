import { gql } from 'graphql-request';

const GetAppDetailsEvolutions = gql`
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

export default GetAppDetailsEvolutions;

import { gql } from 'graphql-request';

const GetFaqsByParams = gql`
    query getFaqsByParams {
        getFaqsByParams {
            title
            description
            color
            links {
                type
                label
                value
                description
            }
        }
    }
`;

export default GetFaqsByParams;

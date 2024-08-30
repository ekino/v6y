import { gql } from 'graphql-request';

const GetFaqsByParams = gql`
    query getFaqsByParams {
        getFaqsByParams {
            _id
            title
            description
            links {
                label
                value
                description
            }
        }
    }
`;

export default GetFaqsByParams;

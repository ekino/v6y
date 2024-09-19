import { gql } from 'graphql-request';

const GetFaqListByPageAndParams = gql`
    query getFaqListByPageAndParams {
        getFaqListByPageAndParams {
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

export default GetFaqListByPageAndParams;

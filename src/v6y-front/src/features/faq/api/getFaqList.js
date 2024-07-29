import { gql } from 'graphql-request';

const GetFaqList = gql`
    query getFaqList {
        getFaqList {
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

export default GetFaqList;

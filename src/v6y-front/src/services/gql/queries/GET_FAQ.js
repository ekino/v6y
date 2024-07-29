import { gql } from 'graphql-request';

const GET_FAQ = gql`
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

export default GET_FAQ;

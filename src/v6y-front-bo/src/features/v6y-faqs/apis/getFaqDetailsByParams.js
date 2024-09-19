import { gql } from 'graphql-request';

const GetFaqDetailsByParams = gql`
    query GetFaqDetailsByParams($faqId: String!) {
        getFaqDetailsByParams(faqId: $faqId) {
            id: _id
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

export default GetFaqDetailsByParams;

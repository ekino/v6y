import { gql } from 'graphql-request';

const GetFaqDetails = gql`
    query GetFaqDetails($faqId: String!) {
        getFaqDetailsInfosByParams(faqId: $faqId) {
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

export default GetFaqDetails;

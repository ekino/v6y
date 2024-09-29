import { gql } from 'graphql-request';

const DeleteFaq = gql`
    mutation DeleteFaq($input: FaqDeleteInput!) {
        deleteFaq(input: $input) {
            _id
        }
    }
`;

export default DeleteFaq;

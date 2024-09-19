import { gql } from 'graphql-request';

const DeleteFaq = gql`
    mutation DeleteFaq($input: FaqDeleteInput!) {
        deleteFaq(input: $input) {
            id: _id
        }
    }
`;

export default DeleteFaq;

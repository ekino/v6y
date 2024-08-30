import { gql } from 'graphql-request';

const CreateOrEditFaq = gql`
    mutation CreateOrEditFaq($faqInput: FaqCreateOrEditInput!) {
        createOrEditFaq(faqInput: $faqInput) {
            id: _id
        }
    }
`;

export default CreateOrEditFaq;

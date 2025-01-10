import { gql } from 'graphql-request';

const CreateOrEditFaq = gql`
    mutation CreateOrEditFaq($faqInput: FaqCreateOrEditInput!) {
        createOrEditFaq(faqInput: $faqInput) {
            _id
        }
    }
`;

export default CreateOrEditFaq;

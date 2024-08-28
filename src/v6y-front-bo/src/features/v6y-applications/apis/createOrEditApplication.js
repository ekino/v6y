import { gql } from 'graphql-request';

const CreateOrEditApplication = gql`
    mutation createOrEditApplication($id: String!, $object: categories_set_input!) {
        createOrEditApplication(pk_columns: { id: $id }, _set: $object) {
            id
            name
            acronym
            description
        }
    }
`;

export default CreateOrEditApplication;

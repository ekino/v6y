import { gql } from 'graphql-request';

const CreateOrEditApplication = gql`
    mutation CreateOrEditApplication($applicationInput: ApplicationCreateOrEditInput!) {
        createOrEditApplication(applicationInput: $applicationInput) {
            id: _id
        }
    }
`;

export default CreateOrEditApplication;

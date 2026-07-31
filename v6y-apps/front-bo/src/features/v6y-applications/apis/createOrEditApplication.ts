import { gql } from 'graphql-request';

const CreateOrEditApplication = gql`
    mutation CreateOrEditApplication($applicationInput: ApplicationCreateOrEditInput!) {
        createOrEditApplication(applicationInput: $applicationInput) {
            _id
            auditFrequencyScheduled
        }
    }
`;

export default CreateOrEditApplication;

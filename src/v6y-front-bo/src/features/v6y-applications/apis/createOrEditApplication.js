import { gql } from 'graphql-request';

const CreateOrEditApplication = gql`
    mutation createOrEditApplication($applicationInput: AppCreateOrEditInput!) {
        createOrEditApplication(applicationInput: $applicationInput) {
            id: _id
            name
            acronym
            contactMail
            description
            links {
                label
                value
                description
            }
            repo {
                name
                owner
                fullName
                webUrl
                gitUrl
                allBranches
            }
        }
    }
`;

export default CreateOrEditApplication;

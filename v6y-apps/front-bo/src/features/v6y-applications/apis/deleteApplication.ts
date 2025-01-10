import { gql } from 'graphql-request';

const DeleteApplication = gql`
    mutation DeleteApplication($input: ApplicationDeleteInput!) {
        deleteApplication(input: $input) {
            _id
        }
    }
`;

export default DeleteApplication;

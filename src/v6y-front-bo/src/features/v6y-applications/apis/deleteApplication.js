import { gql } from 'graphql-request';

const DeleteApplication = gql`
    mutation DeleteApplication($input: AppDeleteInput!) {
        deleteApplication(input: $input) {
            id: _id
        }
    }
`;

export default DeleteApplication;

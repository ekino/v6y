import { gql } from 'graphql-request';

const DeleteAuditHelp = gql`
    mutation DeleteAuditHelp($input: AuditHelpDeleteInput!) {
        deleteAuditHelp(input: $input) {
            id: _id
        }
    }
`;

export default DeleteAuditHelp;

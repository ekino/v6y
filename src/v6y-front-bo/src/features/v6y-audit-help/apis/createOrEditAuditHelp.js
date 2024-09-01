import { gql } from 'graphql-request';

const CreateOrEditAuditHelp = gql`
    mutation CreateOrEditAuditHelp($auditHelpInput: AuditHelpCreateOrEditInput!) {
        createOrEditAuditHelp(auditHelpInput: $auditHelpInput) {
            id: _id
        }
    }
`;

export default CreateOrEditAuditHelp;

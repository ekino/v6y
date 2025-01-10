import { gql } from 'graphql-request';

const CreateOrEditAuditHelp = gql`
    mutation CreateOrEditAuditHelp($auditHelpInput: AuditHelpCreateOrEditInput!) {
        createOrEditAuditHelp(auditHelpInput: $auditHelpInput) {
            _id
        }
    }
`;

export default CreateOrEditAuditHelp;

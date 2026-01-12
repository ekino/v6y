import { gql } from 'graphql-request';

const TriggerApplicationAuditMutation = gql`
    mutation triggerApplicationAudit($applicationId: Int!, $branch: String) {
        triggerApplicationAudit(applicationId: $applicationId, branch: $branch) {
            success
            message
            data
        }
    }
`;

export default TriggerApplicationAuditMutation;

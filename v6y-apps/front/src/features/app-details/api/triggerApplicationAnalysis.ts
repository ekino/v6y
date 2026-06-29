import { gql } from 'graphql-request';

const TriggerApplicationAnalysis = gql`
    mutation TriggerApplicationAnalysis($applicationId: Int!) {
        triggerApplicationAnalysis(applicationId: $applicationId) {
            success
            applicationId
            message
        }
    }
`;

export default TriggerApplicationAnalysis;

import { gql } from 'graphql-request';

const GenerateApplicationAiSummary = gql`
    mutation generateApplicationAiSummary($applicationId: Int!, $language: String) {
        generateApplicationAiSummary(applicationId: $applicationId, language: $language) {
            success
            message
            report {
                _id
                appId
                summary
                score
                model
                generatedAt
            }
        }
    }
`;

export default GenerateApplicationAiSummary;

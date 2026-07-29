import { gql } from 'graphql-request';

const GetApplicationAiSummaryByParams = gql`
    query getApplicationAiSummaryByParams($_id: Int!) {
        getApplicationAiSummaryByParams(_id: $_id) {
            _id
            appId
            summary
            model
            generatedAt
        }
    }
`;

export default GetApplicationAiSummaryByParams;

import { gql } from 'graphql-request';

const GetSonarQubeMetrics = gql`
    query getSonarQubeMetrics($_id: Int!) {
        getSonarQubeMetrics(_id: $_id) {
            success
            error
            projectKey
            baseUrl
            qualityGate {
                status
                name
            }
            metrics {
                key
                name
                value
                rating
            }
        }
    }
`;

export default GetSonarQubeMetrics;

import { gql } from 'graphql-request';

const GetKeywordsByParams = gql`
    query getKeywordsByParams {
        getKeywordsByParams {
            label
            version
            status
            helpMessage
        }
    }
`;

export default GetKeywordsByParams;

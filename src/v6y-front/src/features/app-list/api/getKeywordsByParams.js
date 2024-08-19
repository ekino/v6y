import { gql } from 'graphql-request';

const GetKeywordsByParams = gql`
    query getKeywordsByParams {
        getKeywordsByParams {
            type
            status
            label
            helpMessage
        }
    }
`;

export default GetKeywordsByParams;

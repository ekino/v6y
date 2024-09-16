import { gql } from 'graphql-request';

const GetKeywordListByPageAndParams = gql`
    query getKeywordListByPageAndParams {
        getKeywordListByPageAndParams {
            label
        }
    }
`;

export default GetKeywordListByPageAndParams;

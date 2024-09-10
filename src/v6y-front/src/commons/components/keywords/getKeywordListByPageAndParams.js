import { gql } from 'graphql-request';

const GetKeywordListByPageAndParams = gql`
    query getKeywordListByPageAndParams {
        getKeywordListByPageAndParams {
            label
            version
            status
            module {
                branch
                path
                url
            }
        }
    }
`;

export default GetKeywordListByPageAndParams;

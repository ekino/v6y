import { gql } from 'graphql-request';

const GetKeywordListByParams = gql`
    query getKeywordListByParams {
        getKeywordListByParams {
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

export default GetKeywordListByParams;

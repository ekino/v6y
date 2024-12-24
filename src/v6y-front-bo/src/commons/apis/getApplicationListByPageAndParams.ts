import { gql } from 'graphql-request';

const getApplicationListByPageAndParams = gql`
    query GetApplicationListByPageAndParams($sort: String) {
        getApplicationListByPageAndParams(sort: $sort) {
            _id
            acronym
            name
            description
        }
    }
`;

export default getApplicationListByPageAndParams;

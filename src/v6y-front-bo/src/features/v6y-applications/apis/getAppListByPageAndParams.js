import { gql } from 'graphql-request';

const GetAppListByPageAndParams = gql`
    query getAppListByPageAndParams($start: Int, $limit: Int, $sort: String) {
        getAppListByPageAndParams(start: $start, limit: $limit, sort: $sort) {
            id: _id
            acronym
            name
            description
        }
    }
`;

export default GetAppListByPageAndParams;

import { gql } from 'graphql-request';

const GetApplicationList = gql`
    query GetApplicationList($sort: [String]) {
        getApplicationList(sort: $sort) {
            _id
            acronym
            name
            description
        }
    }
`;

export default GetApplicationList;

import { gql } from 'graphql-request';

const GetAppKeywords = gql`
    query getAppKeywords {
        getAppKeywords {
            type
            color
            label
            helpMessage
        }
    }
`;

export default GetAppKeywords;

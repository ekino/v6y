import { gql } from 'graphql-request';

const GET_APP_KEYWORDS = gql`
    query getAppKeywords {
        getAppKeywords {
            type
            color
            label
            helpMessage
        }
    }
`;

export default GET_APP_KEYWORDS;

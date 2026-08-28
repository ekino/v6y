import { gql } from 'graphql-request';

const GetCurrentAccountNotificationSettings = gql`
    query getCurrentAccountNotificationSettings {
        getCurrentAccountNotificationSettings {
            _id
            auditReportEmailsEnabled
            dailyDigestEmailsEnabled
        }
    }
`;

export default GetCurrentAccountNotificationSettings;

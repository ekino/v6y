import { gql } from 'graphql-request';

const UpdateAccountNotificationSettings = gql`
    mutation UpdateAccountNotificationSettings($input: AccountNotificationSettingsInput!) {
        updateAccountNotificationSettings(input: $input) {
            _id
            auditReportEmailsEnabled
            dailyDigestEmailsEnabled
        }
    }
`;

export default UpdateAccountNotificationSettings;

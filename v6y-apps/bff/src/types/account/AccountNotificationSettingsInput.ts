const AccountNotificationSettingsInput = `
    input AccountNotificationSettingsInput {
        """ Whether the account is emailed when one of its audit runs finishes """
        auditReportEmailsEnabled: Boolean

        """ Whether the account receives the daily audit digest email """
        dailyDigestEmailsEnabled: Boolean
    }
`;
export default AccountNotificationSettingsInput;

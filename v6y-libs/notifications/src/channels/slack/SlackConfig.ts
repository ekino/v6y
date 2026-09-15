/**
 * Slack Bot settings for audit notifications.
 *
 * Notifications are opt-in at the infrastructure level: with no bot token
 * configured the notifier keeps running and simply skips the sending step.
 */
const isSlackEnabled = () => !!process.env.V6Y_SLACK_BOT_TOKEN?.length;

const getBotToken = () => process.env.V6Y_SLACK_BOT_TOKEN as string;

const getPublicAppUrl = () => process.env.V6Y_PUBLIC_APP_URL?.replace(/\/+$/, '') || '';

const SlackConfig = {
    isSlackEnabled,
    getBotToken,
    getPublicAppUrl,
};

export default SlackConfig;

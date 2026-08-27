import { WebClient } from '@slack/web-api';

import { AppLogger } from '@v6y/core-logic';

const token = process.env.V6Y_SLACK_BOT_TOKEN;

/**
 * Lazily-initialised Slack WebClient. Null when no bot token is configured so
 * callers can guard cheaply without importing the SDK at runtime.
 */
const client: WebClient | null = token ? new WebClient(token) : null;

if (!client) {
    AppLogger.info('[SlackService] V6Y_SLACK_BOT_TOKEN not set — Slack notifications disabled.');
}

/**
 * Send a plain-text DM to a Slack user.
 *
 * Slack resolves a user ID (U01XXXXXX) as a DM channel automatically when
 * used as the `channel` argument.
 */
const sendDm = async (slackUserId: string, text: string): Promise<void> => {
    if (!client) {
        return;
    }

    try {
        await client.chat.postMessage({ channel: slackUserId, text });
        AppLogger.info(`[SlackService] DM sent to ${slackUserId}`);
    } catch (error) {
        AppLogger.error(`[SlackService] Failed to send DM to ${slackUserId}:`, error);
    }
};

const SlackService = { sendDm };

export default SlackService;

import { WebClient } from '@slack/web-api';

import { AppLogger } from '@v6y/core-logic';

/**
 * Return a WebClient initialised from the current process env, or null when
 * the token is absent. Evaluated on first call so NestJS / dotenv has had a
 * chance to populate process.env before we read it.
 */
let _client: WebClient | null | undefined;
const getClient = (): WebClient | null => {
    if (_client !== undefined) return _client;
    const token = process.env.V6Y_SLACK_BOT_TOKEN;
    _client = token ? new WebClient(token) : null;
    if (!_client) {
        AppLogger.info(
            '[SlackService] V6Y_SLACK_BOT_TOKEN not set — Slack notifications disabled.',
        );
    }
    return _client;
};

/**
 * Send a plain-text DM to a Slack user.
 *
 * Slack resolves a user ID (U01XXXXXX) as a DM channel automatically when
 * used as the `channel` argument. Requires a bot token (xoxb-) with the
 * `chat:write` scope installed on the target workspace.
 */
const sendDm = async (slackUserId: string, text: string): Promise<void> => {
    const client = getClient();
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

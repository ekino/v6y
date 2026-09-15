import { WebClient } from '@slack/web-api';

import { AppLogger } from '@v6y/core-logic';

import SlackConfig from './SlackConfig.ts';

let client: WebClient | null = null;

/**
 * Lazily creates the Slack client on first use, so `dotenv` has had a chance
 * to populate `V6Y_SLACK_BOT_TOKEN` before the token is read (module-level
 * initialization would freeze an empty token if the client were created at
 * import time).
 */
const getClient = (): WebClient | null => {
    if (!SlackConfig.isSlackEnabled()) {
        return null;
    }

    if (!client) {
        client = new WebClient(SlackConfig.getBotToken());
    }

    return client;
};

/**
 * Post one message to a Slack DM or channel. `target` can be a user id
 * (`U0…`, resolved by Slack directly to a DM) or a channel id (`C0…`).
 * Never throws: a delivery problem is reported as `false` and logged so a
 * broken Slack integration never turns a successful audit into a failed
 * BullMQ job.
 */
const sendMessage = async (target: string, text: string): Promise<boolean> => {
    const slackClient = getClient();

    if (!slackClient) {
        AppLogger.info('[SlackClient] Slack is not configured, message skipped.');
        return false;
    }

    if (!target?.length) {
        AppLogger.warn('[SlackClient] No target user/channel id, message skipped.');
        return false;
    }

    try {
        await slackClient.chat.postMessage({ channel: target, text, mrkdwn: true });
        return true;
    } catch (error) {
        AppLogger.error(`[SlackClient] Unable to send message to ${target}: `, error);
        return false;
    }
};

const SlackClient = {
    sendMessage,
};

export default SlackClient;

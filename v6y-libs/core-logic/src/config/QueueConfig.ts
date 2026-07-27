/**
 * Shared BullMQ connection settings for every service that owns a queue.
 *
 * This module deliberately imports nothing from bullmq/ioredis: core-logic is also
 * consumed by the Next.js apps, and pulling a Redis client into that dependency
 * graph would drag it into the browser bundle. Services keep their own queue
 * plumbing and only borrow the environment resolution from here.
 */
const buildQueueConnection = () => ({
    host: process.env.V6Y_QUEUE_HOST || 'localhost',
    port: parseInt(process.env.V6Y_QUEUE_PORT || '6379', 10),
});

const buildQueuePrefix = () => process.env.V6Y_QUEUE_PREFIX || 'v6y';

/**
 * Queues stay off under test so suites never reach for a real Redis server.
 */
const isQueueEnabled = () => process.env.VITEST !== 'true' && process.env.NODE_ENV !== 'test';

const QueueConfig = {
    buildQueueConnection,
    buildQueuePrefix,
    isQueueEnabled,
};

export default QueueConfig;

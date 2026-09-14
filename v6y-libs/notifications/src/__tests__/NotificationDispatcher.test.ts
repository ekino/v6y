import { describe, expect, it, vi } from 'vitest';

import { INotificationChannel, NotificationEvent } from '../channels/INotificationChannel.ts';
import { NotificationDispatcher } from '../dispatcher/NotificationDispatcher.ts';

vi.mock('@v6y/core-logic', () => ({
    AppLogger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const makeChannel = (id: string, available: boolean, notifyFn = vi.fn()): INotificationChannel => ({
    channelId: id,
    isAvailable: () => available,
    notify: notifyFn,
});

describe('NotificationDispatcher', () => {
    it('calls notify on every available channel', async () => {
        const a = makeChannel('a', true);
        const b = makeChannel('b', true);
        const dispatcher = new NotificationDispatcher([a, b]);
        const event: NotificationEvent = { type: 'daily-digest', data: {} };

        await dispatcher.dispatch(event);

        expect(a.notify).toHaveBeenCalledWith(event);
        expect(b.notify).toHaveBeenCalledWith(event);
    });

    it('skips channels that are not available', async () => {
        const enabled = makeChannel('email', true);
        const disabled = makeChannel('slack', false);
        const dispatcher = new NotificationDispatcher([enabled, disabled]);
        const event: NotificationEvent = { type: 'daily-digest', data: {} };

        await dispatcher.dispatch(event);

        expect(enabled.notify).toHaveBeenCalledOnce();
        expect(disabled.notify).not.toHaveBeenCalled();
    });

    it('continues delivering to other channels when one throws', async () => {
        const failing = makeChannel(
            'email',
            true,
            vi.fn().mockRejectedValue(new Error('SMTP down')),
        );
        const working = makeChannel('slack', true);
        const dispatcher = new NotificationDispatcher([failing, working]);

        await expect(
            dispatcher.dispatch({ type: 'daily-digest', data: {} }),
        ).resolves.not.toThrow();

        expect(working.notify).toHaveBeenCalledOnce();
    });

    it('does nothing and does not throw when no channels are available', async () => {
        const dispatcher = new NotificationDispatcher([makeChannel('teams', false)]);

        await expect(
            dispatcher.dispatch({ type: 'daily-digest', data: {} }),
        ).resolves.not.toThrow();
    });
});

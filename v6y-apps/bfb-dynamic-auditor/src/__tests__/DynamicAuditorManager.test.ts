import { afterEach, describe, expect, it, vi } from 'vitest';

const forkWorker = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        WorkerHelper: { forkWorker },
    };
});

const { default: DynamicAuditorManager } = await import('../auditors/DynamicAuditorManager.ts');

describe('DynamicAuditorManager', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('runs every dynamic auditor and reports success', async () => {
        forkWorker.mockResolvedValue(undefined);

        const outcome = await DynamicAuditorManager.startDynamicAudit({ applicationId: 1 });

        expect(forkWorker).toHaveBeenCalledTimes(3);
        expect(outcome.status).toBe('success');
    });

    it('keeps the reports of the auditors that worked when one fails', async () => {
        forkWorker
            .mockRejectedValueOnce(new Error('lighthouse down'))
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined);

        const outcome = await DynamicAuditorManager.startDynamicAudit({ applicationId: 1 });

        // Two auditors produced reports, so the run is not a failure — but the partial
        // failure is named in the message instead of being swallowed.
        expect(forkWorker).toHaveBeenCalledTimes(3);
        expect(outcome.status).toBe('success');
        expect(outcome.message).toContain('Lighthouse');
    });

    it('reports a failure when every auditor fails, since nothing was produced', async () => {
        forkWorker.mockRejectedValue(new Error('everything is down'));

        const outcome = await DynamicAuditorManager.startDynamicAudit({ applicationId: 1 });

        expect(outcome.status).toBe('failed');
        expect(outcome.message).toContain('Lighthouse');
        expect(outcome.message).toContain('SonarQube');
    });
});

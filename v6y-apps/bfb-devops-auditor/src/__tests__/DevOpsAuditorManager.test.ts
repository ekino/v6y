import { afterEach, describe, expect, it, vi } from 'vitest';

const forkWorker = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        WorkerHelper: { forkWorker },
    };
});

const { default: DevOpsAuditorManager } = await import('../auditors/DevOpsAuditorManager.ts');

describe('DevOpsAuditorManager', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('reports a skipped audit as skipped, not as a failure', async () => {
        // DORA metrics are GitLab-only: an application without a resolvable GitLab id
        // has nothing to audit, and that must not fail the caller's audit run.
        forkWorker.mockResolvedValue({
            status: 'skipped',
            message: 'No GitLab repository id resolved; DORA metrics audit skipped.',
        });

        const outcome = await DevOpsAuditorManager.startDevOpsAudit({ applicationId: 1 });

        expect(outcome).toEqual({
            status: 'skipped',
            message: 'No GitLab repository id resolved; DORA metrics audit skipped.',
        });
    });

    it('reports a successful audit as success', async () => {
        forkWorker.mockResolvedValue({ status: 'success' });

        const outcome = await DevOpsAuditorManager.startDevOpsAudit({ applicationId: 1 });

        expect(outcome.status).toBe('success');
    });

    it('reports a failing worker as failed', async () => {
        forkWorker.mockResolvedValue({ status: 'failed', message: 'boom' });

        const outcome = await DevOpsAuditorManager.startDevOpsAudit({ applicationId: 1 });

        expect(outcome).toEqual({ status: 'failed', message: 'boom' });
    });

    it('treats a thrown worker error as failed', async () => {
        forkWorker.mockRejectedValue(new Error('worker died'));

        const outcome = await DevOpsAuditorManager.startDevOpsAudit({ applicationId: 1 });

        expect(outcome.status).toBe('failed');
        expect(outcome.message).toContain('worker died');
    });

    it('still understands the legacy string payload', async () => {
        forkWorker.mockResolvedValue('Audit encountered an error.');

        const outcome = await DevOpsAuditorManager.startDevOpsAudit({ applicationId: 1 });

        expect(outcome.status).toBe('failed');
    });
});

import { describe, expect, it, vi } from 'vitest';

import { AUDIT_RUN_COMPLETED_JOB } from '../NotificationQueue.ts';
import { NotificationQueueService } from '../NotificationQueueService.ts';

describe('NotificationQueueService', () => {
    describe('enqueueAuditRunCompleted', () => {
        it('adds an audit-run-completed job to the queue', async () => {
            const add = vi.fn().mockResolvedValue({ id: 'job-1' });
            const service = new NotificationQueueService({ add } as never);

            await service.enqueueAuditRunCompleted(42);

            expect(add).toHaveBeenCalledWith(
                AUDIT_RUN_COMPLETED_JOB,
                { auditRunId: 42 },
                expect.objectContaining({ attempts: 3 }),
            );
        });

        it('silently returns when the queue is unavailable', async () => {
            const service = new NotificationQueueService();

            await expect(service.enqueueAuditRunCompleted(42)).resolves.not.toThrow();
        });
    });
});

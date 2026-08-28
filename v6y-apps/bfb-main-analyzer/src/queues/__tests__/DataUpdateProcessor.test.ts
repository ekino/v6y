import { afterEach, describe, expect, it, vi } from 'vitest';

const forkWorker = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        DataBaseManager: { connect: vi.fn().mockResolvedValue(undefined) },
        AuditProvider: {
            ...actual.AuditProvider,
            deleteAuditList: vi.fn().mockResolvedValue(true),
        },
        DependencyProvider: {
            ...actual.DependencyProvider,
            deleteDependencyList: vi.fn().mockResolvedValue(true),
        },
        AuditRunProvider: {
            ...actual.AuditRunProvider,
            recoverInterruptedAuditRuns: vi.fn().mockResolvedValue(undefined),
        },
        WorkerHelper: { forkWorker },
    };
});

vi.mock('../../managers/ApplicationManager.ts', () => ({
    default: {
        buildApplicationList: vi.fn().mockResolvedValue(true),
    },
}));

describe('DataUpdateProcessor', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('clears dependencies but keeps audit history before rebuilding the application list', async () => {
        const { DataUpdateProcessor } = await import('../DataUpdateProcessor.ts');
        const { APPLICATION_LIST_UPDATE_JOB } = await import('../DataUpdateQueue.ts');
        const { AuditProvider, DataBaseManager, DependencyProvider } = await import(
            '@v6y/core-logic'
        );
        const { default: ApplicationManager } = await import(
            '../../managers/ApplicationManager.ts'
        );

        const processor = new DataUpdateProcessor();
        const result = await processor.process({
            id: '1',
            name: APPLICATION_LIST_UPDATE_JOB,
            data: {},
        } as never);

        expect(DataBaseManager.connect).toHaveBeenCalled();
        expect(AuditProvider.deleteAuditList).not.toHaveBeenCalled();
        expect(DependencyProvider.deleteDependencyList).toHaveBeenCalled();
        expect(ApplicationManager.buildApplicationList).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('reaps interrupted audit runs before rebuilding the application list', async () => {
        const { DataUpdateProcessor } = await import('../DataUpdateProcessor.ts');
        const { APPLICATION_LIST_UPDATE_JOB } = await import('../DataUpdateQueue.ts');
        const { AuditRunProvider } = await import('@v6y/core-logic');
        const { default: ApplicationManager } = await import(
            '../../managers/ApplicationManager.ts'
        );

        const processor = new DataUpdateProcessor();
        await processor.process({
            id: '1',
            name: APPLICATION_LIST_UPDATE_JOB,
            data: {},
        } as never);

        expect(AuditRunProvider.recoverInterruptedAuditRuns).toHaveBeenCalledTimes(1);
        // The reaper must run before the sweep, otherwise a still-active run would be
        // reused/recreated before the stale ones are cleared.
        const reapOrder = (AuditRunProvider.recoverInterruptedAuditRuns as ReturnType<typeof vi.fn>)
            .mock.invocationCallOrder[0];
        const buildOrder = (ApplicationManager.buildApplicationList as ReturnType<typeof vi.fn>)
            .mock.invocationCallOrder[0];
        expect(reapOrder).toBeLessThan(buildOrder);
    });

    it('forks the keyword worker on a keyword-update job', async () => {
        forkWorker.mockResolvedValue('Keywords Analysis have completed.');

        const { DataUpdateProcessor } = await import('../DataUpdateProcessor.ts');
        const { KEYWORD_UPDATE_JOB } = await import('../DataUpdateQueue.ts');

        const processor = new DataUpdateProcessor();
        const result = await processor.process({
            id: '2',
            name: KEYWORD_UPDATE_JOB,
            data: {},
        } as never);

        expect(forkWorker).toHaveBeenCalledWith(
            './src/workers/KeywordWorker.ts',
            expect.anything(),
        );
        expect(result).toBe('Keywords Analysis have completed.');
    });

    it('forks the evolution worker on an evolution-update job', async () => {
        forkWorker.mockResolvedValue('Evolutions Analysis have completed.');

        const { DataUpdateProcessor } = await import('../DataUpdateProcessor.ts');
        const { EVOLUTION_UPDATE_JOB } = await import('../DataUpdateQueue.ts');

        const processor = new DataUpdateProcessor();
        await processor.process({ id: '3', name: EVOLUTION_UPDATE_JOB, data: {} } as never);

        expect(forkWorker).toHaveBeenCalledWith(
            './src/workers/EvolutionWorker.ts',
            expect.anything(),
        );
    });

    it('fails the job when the worker reports an error, so BullMQ retries it', async () => {
        // These workers swallow their own errors and report them as a message, so the
        // wording is the only failure signal the processor can act on.
        forkWorker.mockResolvedValue('Keywords Analysis  encountered an error.');

        const { DataUpdateProcessor } = await import('../DataUpdateProcessor.ts');
        const { KEYWORD_UPDATE_JOB } = await import('../DataUpdateQueue.ts');

        const processor = new DataUpdateProcessor();

        await expect(
            processor.process({ id: '4', name: KEYWORD_UPDATE_JOB, data: {} } as never),
        ).rejects.toThrow('reported a failure');
    });

    it('throws for an unsupported job name', async () => {
        const { DataUpdateProcessor } = await import('../DataUpdateProcessor.ts');

        const processor = new DataUpdateProcessor();

        await expect(
            processor.process({ id: '5', name: 'unknown-job', data: {} } as never),
        ).rejects.toThrow('Unsupported data update job: unknown-job');
    });
});

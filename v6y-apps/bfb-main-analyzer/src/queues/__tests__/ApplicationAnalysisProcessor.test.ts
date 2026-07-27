import { afterEach, describe, expect, it, vi } from 'vitest';

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
    };
});

vi.mock('../../managers/ApplicationManager.ts', () => ({
    default: {
        buildApplicationList: vi.fn().mockResolvedValue(true),
        buildApplicationReportsById: vi.fn().mockResolvedValue(true),
    },
}));

describe('ApplicationAnalysisProcessor', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('clears dependencies (but keeps audit history) then rebuilds the application list on a startup job', async () => {
        const { ApplicationAnalysisProcessor } = await import('../ApplicationAnalysisProcessor.ts');
        const { APPLICATION_ANALYSIS_STARTUP_JOB } = await import('../ApplicationAnalysisQueue.ts');
        const { AuditProvider, DataBaseManager, DependencyProvider } = await import(
            '@v6y/core-logic'
        );
        const { default: ApplicationManager } = await import(
            '../../managers/ApplicationManager.ts'
        );

        const processor = new ApplicationAnalysisProcessor();
        const job = { id: '1', name: APPLICATION_ANALYSIS_STARTUP_JOB, data: {} } as never;

        const result = await processor.process(job);

        expect(DataBaseManager.connect).toHaveBeenCalled();
        expect(AuditProvider.deleteAuditList).not.toHaveBeenCalled();
        expect(DependencyProvider.deleteDependencyList).toHaveBeenCalled();
        expect(ApplicationManager.buildApplicationList).toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('builds the reports for a single application on an application-analysis job', async () => {
        const { ApplicationAnalysisProcessor } = await import('../ApplicationAnalysisProcessor.ts');
        const { APPLICATION_ANALYSIS_SINGLE_JOB } = await import('../ApplicationAnalysisQueue.ts');
        const { default: ApplicationManager } = await import(
            '../../managers/ApplicationManager.ts'
        );

        const processor = new ApplicationAnalysisProcessor();
        const job = {
            id: '2',
            name: APPLICATION_ANALYSIS_SINGLE_JOB,
            data: { applicationId: 42 },
        } as never;

        const result = await processor.process(job);

        expect(ApplicationManager.buildApplicationReportsById).toHaveBeenCalledWith(42);
        expect(result).toBe(true);
    });

    it('throws when the application-analysis job is missing an applicationId', async () => {
        const { ApplicationAnalysisProcessor } = await import('../ApplicationAnalysisProcessor.ts');
        const { APPLICATION_ANALYSIS_SINGLE_JOB } = await import('../ApplicationAnalysisQueue.ts');

        const processor = new ApplicationAnalysisProcessor();
        const job = { id: '3', name: APPLICATION_ANALYSIS_SINGLE_JOB, data: {} } as never;

        await expect(processor.process(job)).rejects.toThrow(
            'The applicationId is required to process an application analysis',
        );
    });

    it('throws for an unsupported job name', async () => {
        const { ApplicationAnalysisProcessor } = await import('../ApplicationAnalysisProcessor.ts');

        const processor = new ApplicationAnalysisProcessor();
        const job = { id: '4', name: 'unknown-job', data: {} } as never;

        await expect(processor.process(job)).rejects.toThrow(
            'Unsupported application analysis job: unknown-job',
        );
    });
});

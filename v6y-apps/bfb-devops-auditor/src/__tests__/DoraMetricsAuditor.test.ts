import { afterEach, describe, expect, it, vi } from 'vitest';

const getApplicationDetailsInfoByParams = vi.fn();
const getRepositoryDetails = vi.fn();
const insertAuditList = vi.fn();

vi.mock('@v6y/core-logic', async () => {
    const actual = await vi.importActual<typeof import('@v6y/core-logic')>('@v6y/core-logic');

    return {
        ...actual,
        ApplicationProvider: { getApplicationDetailsInfoByParams },
        RepositoryApi: { ...actual.RepositoryApi, getRepositoryDetails },
        AuditProvider: { ...actual.AuditProvider, insertAuditList },
    };
});

const { default: DoraMetricsAuditor } = await import(
    '../auditors/dora-metrics/DoraMetricsAuditor.ts'
);

const application = (webUrl: string) => ({
    _id: 1,
    repo: {
        organization: 'ekino',
        gitUrl: 'https://github.com/ekino/v6y.git',
        webUrl,
    },
});

describe('DoraMetricsAuditor', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('skips a GitHub-hosted repository instead of reporting empty metrics as success', async () => {
        // DORA is computed from GitLab-only endpoints, and the fetch helpers default to
        // GitLab URLs. Proceeding with a GitHub repository id would query GitLab with
        // it, get nothing back, and store empty metrics as a clean success.
        getApplicationDetailsInfoByParams.mockResolvedValue(
            application('https://github.com/ekino/v6y'),
        );

        const outcome = await DoraMetricsAuditor.startAuditorAnalysis({ applicationId: 1 });

        expect(outcome.status).toBe('skipped');
        expect(outcome.message).toContain('GitLab-hosted');
        expect(getRepositoryDetails).not.toHaveBeenCalled();
        expect(insertAuditList).not.toHaveBeenCalled();
    });

    it('skips when no GitLab repository id can be resolved', async () => {
        getApplicationDetailsInfoByParams.mockResolvedValue(
            application('https://gitlab.com/ekino/v6y'),
        );
        getRepositoryDetails.mockResolvedValue(null);

        const outcome = await DoraMetricsAuditor.startAuditorAnalysis({ applicationId: 1 });

        expect(outcome.status).toBe('skipped');
        expect(getRepositoryDetails).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'gitlab' }),
        );
        expect(insertAuditList).not.toHaveBeenCalled();
    });

    it('fails when the application cannot be found', async () => {
        getApplicationDetailsInfoByParams.mockResolvedValue(null);

        const outcome = await DoraMetricsAuditor.startAuditorAnalysis({ applicationId: 404 });

        expect(outcome.status).toBe('failed');
    });
});

import { afterEach, describe, expect, it, vi } from 'vitest';

const execFileSyncMock = vi.fn();
vi.mock('child_process', () => ({
    default: { execFileSync: execFileSyncMock },
    execFileSync: execFileSyncMock,
}));

const resolveMock = vi.fn(() => '/resolved/path/to/jscpd/bin/jscpd');
vi.mock('module', () => ({
    default: { createRequire: () => ({ resolve: resolveMock }) },
    createRequire: () => ({ resolve: resolveMock }),
}));

const getApplicationDetailsInfoByParamsMock = vi.fn();
const insertAuditListMock = vi.fn();
const getFileContentMock = vi.fn();
const deleteAuditFileMock = vi.fn();

vi.mock('@v6y/core-logic', () => ({
    AppLogger: {
        info: vi.fn(),
        error: vi.fn(),
    },
    ApplicationProvider: {
        getApplicationDetailsInfoByParams: getApplicationDetailsInfoByParamsMock,
    },
    AuditProvider: {
        insertAuditList: insertAuditListMock,
    },
    AuditUtils: {
        getFileContent: getFileContentMock,
        deleteAuditFile: deleteAuditFileMock,
    },
}));

const { default: CodeDuplicationAuditor } = await import(
    '../auditors/code-duplication/CodeDuplicationAuditor.ts'
);

describe('CodeDuplicationAuditor.startAuditorAnalysis', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return false when applicationId or workspaceFolder is missing', async () => {
        const result = await CodeDuplicationAuditor.startAuditorAnalysis({
            applicationId: undefined,
            workspaceFolder: '',
        } as never);

        expect(result).toBe(false);
        expect(execFileSyncMock).not.toHaveBeenCalled();
    });

    it('should return false when the application cannot be found', async () => {
        getApplicationDetailsInfoByParamsMock.mockResolvedValueOnce(undefined);

        const result = await CodeDuplicationAuditor.startAuditorAnalysis({
            applicationId: 1,
            workspaceFolder: '/tmp/workspace',
        } as never);

        expect(result).toBe(false);
        expect(execFileSyncMock).not.toHaveBeenCalled();
    });

    it('should invoke jscpd via execFileSync with the resolved binary path instead of a global npm install', async () => {
        getApplicationDetailsInfoByParamsMock.mockResolvedValueOnce({
            _id: 1,
            repo: { webUrl: 'https://repo.url' },
        });
        getFileContentMock.mockResolvedValueOnce(
            JSON.stringify({
                statistics: { total: { percentage: 0, duplicatedLines: 0 } },
                duplicates: [],
            }),
        );
        insertAuditListMock.mockResolvedValueOnce(true);

        const result = await CodeDuplicationAuditor.startAuditorAnalysis({
            applicationId: 1,
            workspaceFolder: '/tmp/workspace',
            auditRunId: 'run-1',
        } as never);

        expect(result).toBe(true);
        expect(execFileSyncMock).toHaveBeenCalledWith(
            process.execPath,
            expect.arrayContaining(['/resolved/path/to/jscpd/bin/jscpd', '--silent']),
            { stdio: 'ignore' },
        );
        const [, calledArgs] = execFileSyncMock.mock.calls[0];
        // Every arg must be a plain string (e.g. multi-value options like --format
        // must be joined, not passed through as arrays) since execFileSync requires
        // readonly string[].
        expect(calledArgs.every((arg: unknown) => typeof arg === 'string')).toBe(true);
        expect(calledArgs).toContain('--format');
        expect(calledArgs[calledArgs.indexOf('--format') + 1]).toBe(
            'javascript,typescript,jsx,tsx',
        );
        expect(deleteAuditFileMock).toHaveBeenCalledWith({
            filePath: '',
            fileFullPath: '/tmp/workspace/jscpd-report.json',
        });
        expect(insertAuditListMock).toHaveBeenCalled();
    });

    it('should return false and log when jscpd execution fails but continue gracefully', async () => {
        getApplicationDetailsInfoByParamsMock.mockResolvedValueOnce({
            _id: 1,
            repo: { webUrl: 'https://repo.url' },
        });
        execFileSyncMock.mockImplementationOnce(() => {
            throw new Error('jscpd failed');
        });
        getFileContentMock.mockResolvedValueOnce('');

        const result = await CodeDuplicationAuditor.startAuditorAnalysis({
            applicationId: 1,
            workspaceFolder: '/tmp/workspace',
        } as never);

        expect(result).toBe(false);
        expect(insertAuditListMock).not.toHaveBeenCalled();
    });
});

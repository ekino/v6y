import Madge from 'madge';
import { describe, expect, it, vi } from 'vitest';

import { auditStatus, scoreStatus } from '@v6y/core-logic';

import CodeCouplingUtils from '../auditors/code-coupling/CodeCouplingUtils.ts';
import { AuditCommonsType } from '../auditors/types/AuditCommonsType.ts';

// Mock external modules
vi.mock('madge', () => ({
    default: vi.fn(),
}));

describe('CodeCouplingUtils.formatCodeCouplingReports', () => {
    it('should return an empty array when application or workspaceFolder is missing', async () => {
        const result = await CodeCouplingUtils.formatCodeCouplingReports({} as AuditCommonsType);
        expect(result).toEqual([]);
    });

    it('should return null when Madge analysis fails', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (Madge as unknown).mockResolvedValue(null);

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: {},
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);
        expect(result).toBeNull();
    });

    it('should return only circular dependency reports when there are no other dependencies', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (Madge as unknown).mockResolvedValue({
            obj: () => ({}),
            circularGraph: () => ({
                'src/file1.ts': ['src/file2.ts'],
                'src/file2.ts': ['src/file1.ts'],
            }),
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        });

        expect(result).toEqual([
            {
                type: 'Code-Coupling',
                category: 'circular-dependencies',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                score: null,
                scoreUnit: '',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'src/file1.ts -> [src/file2.ts]',
                },
            },
            {
                type: 'Code-Coupling',
                category: 'circular-dependencies',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                score: null,
                scoreUnit: '',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'src/file2.ts -> [src/file1.ts]',
                },
            },
        ]);
    });

    it('should return efferent, afferent, and instability reports when there are dependencies but no circular ones', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (Madge as unknown).mockResolvedValue({
            obj: () => ({
                'src/file1.ts': ['src/file2.ts', 'src/file3.ts'],
                'src/file2.ts': ['src/file3.ts'],
                'src/file3.ts': [],
            }),
            circularGraph: () => ({}),
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        });

        expect(result).toHaveLength(9);
    });

    it('should return efferent, afferent, and instability reports when there are dependencies and circular ones', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (Madge as unknown).mockResolvedValue({
            obj: () => ({
                'src/file1.ts': ['src/file2.ts', 'src/file3.ts'],
                'src/file2.ts': ['src/file3.ts'],
                'src/file3.ts': ['src/file1.ts'],
            }),
            circularGraph: () => ({
                'src/file1.ts': ['src/file3.ts'],
            }),
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        });

        expect(result).toHaveLength(10);
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    type: 'Code-Coupling',
                    category: 'circular-dependencies',
                    auditStatus: auditStatus.success,
                    scoreStatus: scoreStatus.error,
                }),
                expect.objectContaining({
                    type: 'Code-Coupling',
                    category: 'efferent-coupling',
                    auditStatus: auditStatus.success,
                    scoreStatus: scoreStatus.info,
                }),
                expect.objectContaining({
                    type: 'Code-Coupling',
                    category: 'afferent-coupling',
                    auditStatus: auditStatus.success,
                    scoreStatus: scoreStatus.info,
                }),
                expect.objectContaining({
                    type: 'Code-Coupling',
                    category: 'instability-index',
                    auditStatus: auditStatus.success,
                    scoreStatus: scoreStatus.info,
                }),
            ]),
        );
    });

    it('should handle empty dependency tree and circular graph', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (Madge as unknown).mockResolvedValue({
            obj: () => ({}),
            circularGraph: () => ({}),
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        });

        expect(result).toEqual([]);
    });

    it('should handle missing dependencies in the tree', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (Madge as unknown).mockResolvedValue({
            obj: () => ({
                'src/file1.ts': [],
            }),
            circularGraph: () => ({}),
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        });

        expect(result).toEqual([
            {
                type: 'Code-Coupling',
                category: 'efferent-coupling',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                score: 0,
                scoreUnit: '',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'src/file1.ts -> []',
                },
            },
            {
                type: 'Code-Coupling',
                category: 'afferent-coupling',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                score: 0,
                scoreUnit: '',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'src/file1.ts -> []',
                },
            },
            {
                type: 'Code-Coupling',
                category: 'instability-index',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                score: 0,
                scoreUnit: '',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'src/file1.ts',
                },
            },
        ]);
    });
});

import { describe, expect, it, vi } from 'vitest';

import { AppLogger, auditStatus, scoreStatus } from '@v6y/core-logic';

import CodeModularityUtils from '../auditors/code-modularity/CodeModularityUtils.ts';
import { CodeModularityAuditType, ProjectTree } from '../auditors/types/CodeModularityAuditType.ts';

// Mock external modules
vi.mock('xml2js', () => {
    const ParserMock = vi.fn(() => ({
        parseStringPromise: vi.fn(),
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (ParserMock as unknown).prototype.constructor = ParserMock;

    return {
        default: {
            Parser: ParserMock,
        },
    };
});

describe('CodeModularityUtils', () => {
    it('should normalize an empty project tree', () => {
        const emptyTree: ProjectTree = {};
        const result = CodeModularityUtils.normalizeProjectTree(emptyTree);
        expect(result).toEqual({
            nodes: [],
            edges: [],
        });
    });

    it('should normalize a non-empty project tree', () => {
        const tree: ProjectTree = {
            'src/index.ts': ['src/utils.ts', 'src/components/button.tsx'],
            'src/utils.ts': [],
            'src/components/button.tsx': ['src/components/styles.ts'],
            'src/components/styles.ts': [],
        };

        const result = CodeModularityUtils.normalizeProjectTree(tree);
        expect(result).toEqual({
            nodes: [
                'src/index.ts',
                'src/utils.ts',
                'src/components/button.tsx',
                'src/components/styles.ts',
            ],
            edges: [
                ['src/index.ts', 'src/utils.ts'],
                ['src/index.ts', 'src/components/button.tsx'],
                ['src/components/button.tsx', 'src/components/styles.ts'],
            ],
        });
    });

    it('should return null when modularitySummary, application or workspaceFolder is missing', () => {
        const result1 = CodeModularityUtils.formatCodeModularityReports(
            {} as CodeModularityAuditType,
        );
        expect(result1).toBeNull();

        const result2 = CodeModularityUtils.formatCodeModularityReports({
            modularitySummary: {},
        } as CodeModularityAuditType);
        expect(result2).toBeNull();

        const result3 = CodeModularityUtils.formatCodeModularityReports({
            modularitySummary: {},
            application: {},
        } as CodeModularityAuditType);
        expect(result3).toBeNull();
    });

    it('should generate correct reports when modularitySummary is provided', () => {
        const result = CodeModularityUtils.formatCodeModularityReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
            modularitySummary: {
                projectLouvainDetails: {
                    communities: {
                        'src/file1.ts': 0,
                        'src/file2.ts': 1,
                        'src/file3.ts': 0,
                    },
                    modularity: 0.6,
                },
                projectDegreeCentrality: {
                    'src/file1.ts': 2,
                    'src/file2.ts': 1,
                },
                projectInDegreeCentrality: {
                    'src/file1.ts': 1,
                },
                projectOutDegreeCentrality: {
                    'src/file2.ts': 1,
                },
                projectDensity: 0.4,
            },
        });

        expect(result).toEqual([
            {
                category: 'interaction-density',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '/path/to/project',
                    url: 'https://repo.url',
                },
                score: 0.6,
                scoreUnit: '%',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                type: 'Code-Modularity',
            },
            {
                category: 'independent-files-ratio',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '/path/to/project',
                    url: 'https://repo.url',
                },
                score: 0.4,
                scoreUnit: '%',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                type: 'Code-Modularity',
            },
            {
                category: 'interaction-groups',
                extraInfos: 'group-0',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '[src/file1.ts, src/file3.ts]',
                    url: 'https://repo.url',
                },
                score: null,
                scoreUnit: '',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                type: 'Code-Modularity',
            },
            {
                category: 'interaction-groups',
                extraInfos: 'group-1',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '[src/file2.ts]',
                    url: 'https://repo.url',
                },
                score: null,
                scoreUnit: '',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                type: 'Code-Modularity',
            },
            {
                category: 'file-degree-centrality',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: 'src/file1.ts',
                    url: 'https://repo.url',
                },
                score: 2,
                scoreUnit: '',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                type: 'Code-Modularity',
            },
            {
                category: 'file-degree-centrality',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: 'src/file2.ts',
                    url: 'https://repo.url',
                },
                score: 1,
                scoreUnit: '',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                type: 'Code-Modularity',
            },
            {
                category: 'file-in-degree-centrality',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: 'src/file1.ts',
                    url: 'https://repo.url',
                },
                score: 1,
                scoreUnit: '',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                type: 'Code-Modularity',
            },
            {
                category: 'file-out-degree-centrality',
                module: {
                    appId: 1,
                    branch: 'project',
                    path: 'src/file2.ts',
                    url: 'https://repo.url',
                },
                score: 1,
                scoreUnit: '',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.info,
                type: 'Code-Modularity',
            },
        ]);
    });

    it('should handle errors gracefully', () => {
        vi.spyOn(AppLogger, 'info').mockImplementationOnce(() => {
            throw new Error('Some error');
        });

        const result = CodeModularityUtils.formatCodeModularityReports({
            modularitySummary: {},
        } as CodeModularityAuditType);

        expect(result).toBeNull();
        expect(AppLogger.info).toHaveBeenCalledWith(
            '[CodeModularityUtils - formatCodeModularityReports] error:  Error: Some error',
        );
    });
});

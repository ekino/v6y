/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditUtils, DeprecatedDependencyProvider, SemverUtils } from '@v6y/core-logic';
import { describe, expect, it, vi } from 'vitest';

import DependenciesUtils from '../auditors/dependencies-auditor/DependenciesUtils.ts';
import { AuditCommonsType } from '../auditors/types/AuditCommonsType.ts';

// Mock commons modules
vi.mock('@v6y/core-logic', async () => {
    const actualModule = (await vi.importActual(
        '@v6y/core-logic',
    )) as typeof import('@v6y/core-logic');

    return {
        ...actualModule,
        AuditUtils: {
            getFilesRecursively: vi.fn(),
            getFileContent: vi.fn(),
        },
        DeprecatedDependencyProvider: {
            getDeprecatedDependencyDetailsByParams: vi.fn(),
        },
        SemverUtils: {
            compareVersions: vi.fn(),
        },
    };
});

// Mock the fetch function
global.fetch = vi.fn();

describe('DependenciesUtils.formatDependenciesReports', () => {
    it('should return an empty array when application or workspaceFolder is missing', async () => {
        const result = await DependenciesUtils.formatDependenciesReports({} as AuditCommonsType);
        expect(result).toEqual([]);
    });

    it('should return an empty array when no package.json files are found', async () => {
        (AuditUtils.getFilesRecursively as any).mockReturnValue([]);

        const result = await DependenciesUtils.formatDependenciesReports({
            application: {},
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);

        expect(result).toEqual([]);
    });

    it('should generate dependency audit reports', async () => {
        (AuditUtils.getFilesRecursively as any).mockReturnValue([
            '/path/to/project/package.json',
            '/path/to/project/subfolder/package.json',
        ]);

        (AuditUtils.getFileContent as any)
            .mockResolvedValueOnce(
                JSON.stringify({
                    dependencies: {
                        react: '^18.0.0',
                        lodash: '4.17.21',
                    },
                }),
            )
            .mockResolvedValueOnce(
                JSON.stringify({
                    devDependencies: {
                        jest: '29.2.0',
                    },
                }),
            );

        (global.fetch as any)
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        'dist-tags': { latest: '18.2.0' },
                    }),
            })
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        'dist-tags': { latest: '4.17.21' },
                    }),
            })
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        'dist-tags': { latest: '29.5.0' },
                    }),
            });

        (SemverUtils.compareVersions as any)
            .mockReturnValueOnce(true) // react is outdated
            .mockReturnValueOnce(false) // lodash is up-to-date
            .mockReturnValueOnce(true); // jest is outdated

        (DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams as any)
            .mockResolvedValueOnce(undefined) // react is not deprecated
            .mockResolvedValueOnce({ _id: 'some-id' }) // lodash is deprecated
            .mockResolvedValueOnce(undefined); // jest is not deprecated

        const result = await DependenciesUtils.formatDependenciesReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);

        expect(result).toEqual([
            {
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '/path/to/project/package.json',
                    url: 'https://repo.url',
                },
                name: 'react',
                recommendedVersion: '18.2.0',
                status: 'outdated',
                type: 'frontend',
                version: '^18.0.0',
            },
            {
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '/path/to/project/package.json',
                    url: 'https://repo.url',
                },
                name: 'lodash',
                recommendedVersion: '4.17.21',
                status: 'deprecated',
                type: 'frontend',
                version: '4.17.21',
            },
            {
                module: {
                    appId: 1,
                    branch: 'project',
                    path: '/path/to/project/subfolder/package.json',
                    url: 'https://repo.url',
                },
                name: 'jest',
                recommendedVersion: '29.5.0',
                status: 'outdated',
                type: 'frontend',
                version: '29.2.0',
            },
        ]);
    });

    it('should handle errors gracefully', async () => {
        (AuditUtils.getFilesRecursively as any).mockImplementationOnce(() => {
            throw new Error('Some error');
        });

        const result = await DependenciesUtils.formatDependenciesReports({
            application: {},
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);

        expect(result).toEqual([]);
    });
});

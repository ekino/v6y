import { AuditUtils, SemverUtils } from '@v6y/commons';
import { codeSmellCategories as dependencyStatus } from '@v6y/commons/src/config/CodeSmellConfig.js';
import DeprecatedDependencyProvider from '@v6y/commons/src/database/DeprecatedDependencyProvider.js';

import DependenciesUtils from '../DependenciesUtils.js';

// Mocking external modules
jest.mock('@v6y/commons', () => ({
    AppLogger: {
        info: jest.fn(),
    },
    AuditUtils: {
        getFilesRecursively: jest.fn(),
        getFileContent: jest.fn(),
    },
    SemverUtils: {
        compareVersions: jest.fn(),
    },
}));

jest.mock('@v6y/commons/src/database/DeprecatedDependencyProvider.js', () => ({
    getDeprecatedDependencyDetailsByParams: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn();

describe('DependenciesUtils', () => {
    describe('formatDependenciesReports', () => {
        const mockApplication = {
            _id: 'app123',
            repo: { webUrl: 'https://github.com/example/repo' },
        };
        const mockWorkspaceFolder = '/path/to/workspace';

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return an empty array if no application or workspaceFolder is provided', async () => {
            const result = await DependenciesUtils.formatDependenciesReports({});
            expect(result).toEqual([]);
        });

        it('should return an empty array if no package.json files are found', async () => {
            AuditUtils.getFilesRecursively.mockReturnValue([]);
            const result = await DependenciesUtils.formatDependenciesReports({
                application: mockApplication,
                workspaceFolder: mockWorkspaceFolder,
            });
            expect(result).toEqual([]);
        });

        it('should generate dependency audit reports for each dependency in package.json files', async () => {
            AuditUtils.getFilesRecursively.mockReturnValue(['/path/to/workspace/package.json']);
            AuditUtils.getFileContent.mockResolvedValue(`
                {
                    "dependencies": {
                        "react": "18.2.0",
                        "lodash": "4.17.21"
                    },
                    "devDependencies": {
                        "jest": "29.5.0"
                    }
                }
            `);

            fetch.mockResolvedValue({
                json: () => Promise.resolve({ 'dist-tags': { latest: '18.3.0' } }), // Mock response for 'react'
            });
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve({ 'dist-tags': { latest: '4.17.21' } }), // Mock response for 'lodash'
            });
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve({ 'dist-tags': { latest: '29.6.0' } }), // Mock response for 'jest'
            });

            DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams.mockResolvedValue(
                null,
            ); // No deprecated dependencies

            SemverUtils.compareVersions.mockImplementation((version, latest) => version < latest);

            const result = await DependenciesUtils.formatDependenciesReports({
                application: mockApplication,
                workspaceFolder: mockWorkspaceFolder,
            });

            expect(result.length).toBe(3);
            expect(result[0].name).toBe('jest');
            expect(result[0].status).toBe(dependencyStatus.outdated);
            expect(result[1].name).toBe('react');
        });
    });
});

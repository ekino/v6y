import { AppLogger } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';
import Madge from 'madge';

import CodeCouplingUtils from '../CodeCouplingUtils.js';

// Mock AppLogger
jest.mock('@v6y/commons', () => ({
    AppLogger: {
        info: jest.fn(),
    },
}));

// Mock Madge
jest.mock('madge', () => {
    const mockMadgeInstance = {
        obj: jest.fn(),
        circularGraph: jest.fn(),
    };
    return jest.fn(() => mockMadgeInstance);
});

describe('CodeCouplingUtils', () => {
    const mockApplication = {
        _id: 'app123',
        repo: { webUrl: 'https://github.com/example/repo' },
    };

    const mockWorkspaceFolder = '/path/to/workspace';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an empty array if no application or workspaceFolder is provided', async () => {
        const result = await CodeCouplingUtils.formatCodeCouplingReports({});
        expect(result).toEqual([]);
    });

    it('should return an empty object if Madge parsing fails', async () => {
        // Mock Madge to return null for both obj() and circularGraph()
        Madge().obj.mockReturnValue(null);
        Madge().circularGraph.mockReturnValue(null);

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: mockApplication,
            workspaceFolder: mockWorkspaceFolder,
        });
        expect(result).toEqual({});
    });

    it('should generate circular dependency reports if circular dependencies exist', async () => {
        // Mock Madge to return circular dependencies
        Madge().obj.mockReturnValue({});
        Madge().circularGraph.mockReturnValue({
            'fileA.js': ['fileB.js', 'fileC.js'],
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: mockApplication,
            workspaceFolder: mockWorkspaceFolder,
        });

        expect(result.length).toBe(1);
        expect(result[0].category).toBe('circular-dependencies');
        expect(result[0].status).toBe(auditStatus.error);
        expect(result[0].module.path).toBe('fileA.js -> [fileB.js,fileC.js]');
    });

    it('should generate efferent and afferent coupling reports for each file', async () => {
        // Mock Madge to return dependency tree data
        Madge().obj.mockReturnValue({
            'fileA.js': ['fileB.js'],
            'fileB.js': ['fileC.js'],
            'fileC.js': [],
        });
        Madge().circularGraph.mockReturnValue({});

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: mockApplication,
            workspaceFolder: mockWorkspaceFolder,
        });

        expect(result.length).toBe(9); // 3 files * (efferent + afferent + instability)

        // Assertions for fileA.js
        expect(result[0].category).toBe('efferent-coupling');
        expect(result[0].score).toBe(1);
        expect(result[0].module.path).toBe('fileA.js -> [fileB.js]');

        expect(result[1].category).toBe('afferent-coupling');
        expect(result[1].score).toBe(0);
        expect(result[1].module.path).toBe('fileA.js -> []');

        expect(result[2].category).toBe('instability-index');
        expect(result[2].score).toBe('1.00');
        expect(result[2].module.path).toBe('fileA.js');
    });
    // add more tests
    it('should generate instability index reports correctly', async () => {
        // Mock Madge to return dependency tree data
        Madge().obj.mockReturnValue({
            'fileA.js': ['fileB.js'],
            'fileB.js': ['fileC.js'],
            'fileC.js': [],
        });
        Madge().circularGraph.mockReturnValue({});

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: mockApplication,
            workspaceFolder: mockWorkspaceFolder,
        });

        // Assertions for instability index
        expect(result[2].category).toBe('instability-index');
        expect(result[2].score).toBe('1.00');
        expect(result[2].module.path).toBe('fileA.js');
    });

    it('should handle empty dependency tree gracefully', async () => {
        // Mock Madge to return an empty dependency tree
        Madge().obj.mockReturnValue({});
        Madge().circularGraph.mockReturnValue({});

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: mockApplication,
            workspaceFolder: mockWorkspaceFolder,
        });

        expect(result.length).toBe(0);
    });

    it('should log an error if an exception is thrown', async () => {
        // Mock Madge to throw an error
        Madge.mockImplementation(() => {
            throw new Error('Test error');
        });

        const result = await CodeCouplingUtils.formatCodeCouplingReports({
            application: mockApplication,
            workspaceFolder: mockWorkspaceFolder,
        });

        expect(result).toEqual([]);
        expect(AppLogger.info).toHaveBeenCalledWith(
            '[CodeCouplingUtils - formatCodeCouplingReports] error:  Test error',
        );
    });
});

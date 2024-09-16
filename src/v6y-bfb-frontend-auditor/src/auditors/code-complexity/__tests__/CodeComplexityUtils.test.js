import { AuditUtils } from '@v6y/commons';

import CodeComplexityUtils from '../CodeComplexityUtils.js';

// Mock external modules
jest.mock('@v6y/commons', () => ({
    AppLogger: {
        info: jest.fn(),
    },
    AuditUtils: {
        isAcceptedFileType: jest.fn(),
        isExcludedFile: jest.fn(),
        getFiles: jest.fn(),
        parseFile: jest.fn(),
    },
}));

jest.mock('typhonjs-escomplex', () => ({
    analyzeModule: jest.fn(),
}));

// Mock the CodeComplexityConfig module
jest.mock('../CodeComplexityConfig.js', () => ({
    formatHalsteadReports: jest.fn(),
    formatMaintainabilityIndexReport: jest.fn(),
    formatCyclomaticComplexityReport: jest.fn(),
    formatFileSLOCIndicators: jest.fn(),
    formatCodeComplexitySummary: jest.fn(),
}));

describe('CodeComplexityUtils', () => {
    describe('formatCodeComplexityReports', () => {
        const mockWorkspaceFolder = '/path/to/workspace';
        const mockApplication = { _id: 'app123' };

        beforeEach(() => {
            jest.clearAllMocks(); // Clear all mocks before each test
        });

        it('should return an empty array if no workspaceFolder or application is provided', () => {
            const result = CodeComplexityUtils.formatCodeComplexityReports({});
            expect(result).toEqual([]);
        });

        it('should return an empty array if no files are found', () => {
            AuditUtils.getFiles.mockReturnValue({ files: [], basePath: '/path' });
            const result = CodeComplexityUtils.formatCodeComplexityReports({
                workspaceFolder: mockWorkspaceFolder,
                application: mockApplication,
            });
            expect(result).toEqual([]);
        });

        it('should return an empty array if no auditable files are found', () => {
            AuditUtils.getFiles.mockReturnValue({
                files: ['file1.txt', 'file2.exe'],
                basePath: '/path',
            }); // Non-auditable files
            AuditUtils.isAcceptedFileType.mockReturnValue(false);
            const result = CodeComplexityUtils.formatCodeComplexityReports({
                workspaceFolder: mockWorkspaceFolder,
                application: mockApplication,
            });
            expect(result).toEqual([]);
        });
    });
});

import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';

import CodeDuplicationUtils from '../CodeDuplicationUtils.js';

// Mock AppLogger
jest.mock('@v6y/commons', () => ({
    AppLogger: {
        info: jest.fn(),
    },
}));

// Mock auditStatus values (replace with actual values from AuditHelpConfig)
jest.mock('@v6y/commons/src/config/AuditHelpConfig.js', () => ({
    auditStatus: {
        error: 'error',
        info: 'info',
    },
}));

describe('CodeDuplicationUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an empty array if no duplicationFiles, application or workspaceFolder is provided', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({});
        expect(result).toEqual([]);
    });

    it('should generate file-level duplication reports for each valid duplicationFile', () => {
        const duplicationFiles = [
            {
                firstFile: { name: 'file1.js', start: 10, end: 20 },
                secondFile: { name: 'file2.js', start: 30, end: 40 },
                fragment: 'some duplicated code',
                lines: 5,
            },
            {
                firstFile: { name: '', start: 0, end: 0 }, // Invalid file
                secondFile: { name: 'file3.js', start: 50, end: 60 },
                fragment: 'more duplicated code',
                lines: 8,
            },
        ];
        const params = {
            application: {
                _id: 'app2',
                repo: { webUrl: 'https://github.com/example/repo' },
            },
            workspaceFolder: '/path/to/workspace',
            duplicationTotalSummary: null,
            duplicationFiles,
        };

        const result = CodeDuplicationUtils.formatCodeDuplicationReports(params);

        expect(result.length).toBe(1); // Only one valid duplicationFile
        expect(result[0].category).toBe('code-duplication-file');
        expect(result[0].status).toBe(auditStatus.error);
        expect(result[0].extraInfos).toBe('some duplicated code');
    });

    // Additional Test Cases

    it('should handle a mix of valid and invalid duplicationFile entries', () => {
        const duplicationFiles = [
            {
                firstFile: { name: 'file1.js', start: 10, end: 20 },
                secondFile: { name: 'file2.js', start: 30, end: 40 },
                fragment: 'some duplicated code',
                lines: 5,
            },
            {
                firstFile: { name: '', start: 0, end: 0 }, // Invalid
                secondFile: { name: 'file3.js', start: 50, end: 60 },
                fragment: 'more duplicated code',
                lines: 8,
            },
            {
                firstFile: { name: 'file4.js', start: 70, end: 80 },
                secondFile: { name: 'file5.js', start: 90, end: 100 },
                fragment: 'even more duplicated code',
                lines: 12,
            },
        ];
        const params = {
            application: {
                _id: 'app4',
                repo: { webUrl: 'https://github.com/example/repo' },
            },
            workspaceFolder: '/path/to/workspace',
            duplicationTotalSummary: null,
            duplicationFiles,
        };

        const result = CodeDuplicationUtils.formatCodeDuplicationReports(params);

        expect(result.length).toBe(2); // Two valid duplicationFile entries
    });
});

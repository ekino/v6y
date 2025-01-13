import { describe, expect, it } from 'vitest';

import CodeComplexityUtils from './CodeComplexityUtils.js';

describe('CodeComplexityUtils', () => {
    const mockWorkspaceFolder = './src/auditors/code-complexity';
    const mockApplication = { _id: 1, name: 'TestApp' };

    it('should format code complexity reports correctly', () => {
        const result = CodeComplexityUtils.formatCodeComplexityReports({
            workspaceFolder: mockWorkspaceFolder,
            application: mockApplication,
        });

        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(Array);
    });

    it('should return null if workspaceFolder is empty', () => {
        const result = CodeComplexityUtils.formatCodeComplexityReports({
            workspaceFolder: '',
            application: mockApplication,
        });

        expect(result).toBeNull();
    });

    it('should return null if application is null', () => {
        const result = CodeComplexityUtils.formatCodeComplexityReports({
            workspaceFolder: mockWorkspaceFolder,
            application: undefined,
        });

        expect(result).toBeNull();
    });

    it('should return an empty array if no files are found', () => {
        const result = CodeComplexityUtils.formatCodeComplexityReports({
            workspaceFolder: './non-existent-folder',
            application: mockApplication,
        });

        expect(result).toBeNull();
    });
});

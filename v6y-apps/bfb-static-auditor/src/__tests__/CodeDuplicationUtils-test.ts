import { describe, expect, it, vi } from 'vitest';

import { AppLogger, auditStatus, scoreStatus } from '@v6y/core-logic';

import CodeDuplicationUtils from '../auditors/code-duplication/CodeDuplicationUtils.ts';
import { CodeDuplicationAuditType } from '../auditors/types/CodeDuplicationAuditType.ts';

describe('CodeDuplicationUtils.formatCodeDuplicationReports', () => {
    it('should return an empty array when duplicationFiles is empty or missing', () => {
        const result1 = CodeDuplicationUtils.formatCodeDuplicationReports(
            {} as CodeDuplicationAuditType,
        );
        expect(result1).toEqual([]);

        const result2 = CodeDuplicationUtils.formatCodeDuplicationReports({
            duplicationFiles: [],
        } as CodeDuplicationAuditType);
        expect(result2).toEqual([]);
    });

    it('should return an empty array when application or workspaceFolder is missing', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            duplicationFiles: [
                {
                    firstFile: { name: 'file1.ts' },
                    secondFile: { name: 'file2.ts' },
                },
            ],
        } as CodeDuplicationAuditType);
        expect(result).toEqual([]);
    });

    it('should generate correct reports when duplication exists', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
            duplicationTotalSummary: {
                percentage: 5.2,
                duplicatedLines: 123,
            },
            duplicationFiles: [
                {
                    firstFile: { name: 'file1.ts', start: 10, end: 20 },
                    secondFile: { name: 'file2.ts', start: 5, end: 15 },
                    fragment: '...duplicated code...',
                    lines: 8,
                },
            ],
        } as CodeDuplicationAuditType);

        expect(result).toEqual([
            {
                type: 'Code-Duplication',
                category: 'code-duplication-percent',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error, // Since percentage > 0
                score: 5.2,
                scoreUnit: '%',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: '/path/to/project',
                },
            },
            {
                type: 'Code-Duplication',
                category: 'code-duplication-total-duplicated-lines',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error, // Since duplicatedLines > 0
                score: 123,
                scoreUnit: 'lines',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: '/path/to/project',
                },
            },
            {
                type: 'Code-Duplication',
                category: 'code-duplication-file',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                score: 8,
                scoreUnit: 'lines',
                extraInfos: '...duplicated code...',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'file1.ts (10 - 20) <-> file2.ts (5 - 15)',
                },
            },
        ]);
    });

    it('should handle errors gracefully', () => {
        vi.spyOn(AppLogger, 'info').mockImplementationOnce(() => {
            throw new Error('Some error');
        });

        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            duplicationFiles: [
                {
                    firstFile: { name: 'file1.ts' },
                    secondFile: { name: 'file2.ts' },
                },
            ],
        } as CodeDuplicationAuditType);

        expect(result).toEqual([]);
        expect(AppLogger.info).toHaveBeenCalledWith(
            '[CodeDuplicationUtils - formatCodeDuplicationReports] error:  Error: Some error',
        );
    });

    it('should handle cases with no duplicationTotalSummary', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
            duplicationFiles: [
                {
                    firstFile: { name: 'file1.ts', start: 10, end: 20 },
                    secondFile: { name: 'file2.ts', start: 5, end: 15 },
                    fragment: '...duplicated code...',
                    lines: 8,
                },
            ],
        } as CodeDuplicationAuditType);

        expect(result).toEqual([
            {
                type: 'Code-Duplication',
                category: 'code-duplication-file',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                score: 8,
                scoreUnit: 'lines',
                extraInfos: '...duplicated code...',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'file1.ts (10 - 20) <-> file2.ts (5 - 15)',
                },
            },
        ]);
    });

    it('should handle cases with empty duplicationTotalSummary', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
            duplicationTotalSummary: {},
            duplicationFiles: [
                {
                    firstFile: { name: 'file1.ts', start: 10, end: 20 },
                    secondFile: { name: 'file2.ts', start: 5, end: 15 },
                    fragment: '...duplicated code...',
                    lines: 8,
                },
            ],
        } as CodeDuplicationAuditType);

        expect(result).toEqual([
            {
                type: 'Code-Duplication',
                category: 'code-duplication-file',
                auditStatus: auditStatus.success,
                scoreStatus: scoreStatus.error,
                score: 8,
                scoreUnit: 'lines',
                extraInfos: '...duplicated code...',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'file1.ts (10 - 20) <-> file2.ts (5 - 15)',
                },
            },
        ]);
    });

    it('should handle cases with no duplicationFiles and no duplicationTotalSummary', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        } as CodeDuplicationAuditType);

        expect(result).toEqual([]);
    });

    it('should handle cases with only duplicationTotalSummary', () => {
        const result = CodeDuplicationUtils.formatCodeDuplicationReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
            duplicationTotalSummary: {
                percentage: 0,
                duplicatedLines: 0,
            },
        } as CodeDuplicationAuditType);

        expect(result).toEqual([]);
    });
});

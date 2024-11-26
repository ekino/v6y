import { AuditUtils, auditStatus } from '@v6y/commons';
import { Mock, describe, expect, it, vi } from 'vitest';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import CodeSecurityUtils from './CodeSecurityUtils.ts';

vi.mock('@v6y/commons', async () => {
    const actualModule = await vi.importActual('@v6y/commons');

    return {
        ...actualModule,
        AuditUtils: {
            getFiles: vi.fn(),
            parseFile: vi.fn(),
            isNonCompliantFile: vi.fn(),
        },
    };
});

describe('CodeSecurityUtils.formatCodeModularityReports', () => {
    it('should return an empty array when application or workspaceFolder is missing', async () => {
        const result = await CodeSecurityUtils.formatCodeModularityReports({} as AuditCommonsType);
        expect(result).toEqual([]);
    });

    it('should return an empty array when no files are found', async () => {
        (AuditUtils.getFiles as Mock).mockReturnValue({ files: [], basePath: '/base' });

        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: {},
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);

        expect(result).toEqual([]);
    });

    it('should generate security audit reports when non-compliant files are found', async () => {
        (AuditUtils.getFiles as Mock).mockReturnValue({
            files: ['file1.js', 'file2.ts'],
            basePath: '/base',
        });

        (AuditUtils.parseFile as Mock)
            .mockReturnValueOnce({ source: ['some code', 'eval();'] })
            .mockReturnValueOnce({ source: ['other code'] });

        (AuditUtils.isNonCompliantFile as Mock)
            .mockResolvedValueOnce(true) // Non-compliant for the first file
            .mockResolvedValueOnce(false) // Compliant for the second file
            .mockResolvedValueOnce(false) // Compliant for the first file (second anti-pattern)
            .mockResolvedValueOnce(false); // Compliant for the second file (second anti-pattern)

        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: {
                _id: 1,
                repo: { webUrl: 'https://repo.url' },
            },
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);

        expect(result).toEqual([
            {
                type: 'Code-Security',
                category: 'react-findDOMNode',
                status: auditStatus.error,
                score: null,
                scoreUnit: '',
                module: {
                    appId: 1,
                    url: 'https://repo.url',
                    branch: 'project',
                    path: 'file1.js',
                },
            },
        ]);
    });

    it('should handle errors gracefully', async () => {
        (AuditUtils.getFiles as Mock).mockImplementationOnce(() => {
            throw new Error('Some error');
        });

        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: {},
            workspaceFolder: '/path/to/project',
        } as AuditCommonsType);

        expect(result).toEqual([]);
    });
});

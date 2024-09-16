import { AppLogger, AuditUtils } from '@v6y/commons';
import { securityAntiPatterns } from '@v6y/commons/src/config/CodeSmellConfig.js';

import CodeSecurityUtils from '../CodeSecurityUtils';

jest.mock('@v6y/commons');

describe('CodeSecurityUtils', () => {
    beforeEach(() => {
        AppLogger.info.mockClear();
        AuditUtils.getFiles.mockClear();
        AuditUtils.parseFile.mockClear();
        AuditUtils.isNonCompliantFile.mockClear();
    });

    it('should return empty array if application is not provided', async () => {
        const result = await CodeSecurityUtils.formatCodeModularityReports({
            workspaceFolder: 'some/path',
        });
        expect(result).toEqual([]);
    });

    it('should return empty array if workspaceFolder is not provided', async () => {
        const result = await CodeSecurityUtils.formatCodeModularityReports({ application: {} });
        expect(result).toEqual([]);
    });

    it('should return empty array if no files are found', async () => {
        AuditUtils.getFiles.mockReturnValue({ files: [], basePath: 'base/path' });
        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: {},
            workspaceFolder: 'some/path',
        });
        expect(result).toEqual([]);
    });

    it('should return empty array if no source is found in the report', async () => {
        AuditUtils.getFiles.mockReturnValue({ files: ['file1.js'], basePath: 'base/path' });
        AuditUtils.parseFile.mockReturnValue({ source: '' });
        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: {},
            workspaceFolder: 'some/path',
        });
        expect(result).toEqual([]);
    });

    it('should return security audit reports for non-compliant files', async () => {
        AuditUtils.getFiles.mockReturnValue({ files: ['file1.js'], basePath: 'base/path' });
        AuditUtils.parseFile.mockReturnValue({ source: 'some source code' });
        AuditUtils.isNonCompliantFile.mockResolvedValue(true);

        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: { _id: 'app1', repo: { webUrl: 'http://example.com' } },
            workspaceFolder: 'some/path',
        });

        expect(result?.[0]).toEqual({
            type: 'Code-Security',
            category: securityAntiPatterns[0].category,
            status: 'error',
            score: null,
            scoreUnit: '',
            module: {
                appId: 'app1',
                url: 'http://example.com',
                branch: 'path',
                path: 'file1.js',
            },
        });
    });

    it('should handle errors gracefully and return empty array', async () => {
        AuditUtils.getFiles.mockImplementation(() => {
            throw new Error('Test error');
        });
        const result = await CodeSecurityUtils.formatCodeModularityReports({
            application: {},
            workspaceFolder: 'some/path',
        });
        expect(result).toEqual([]);
    });
});

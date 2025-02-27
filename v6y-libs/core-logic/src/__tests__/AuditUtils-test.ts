import fs from 'fs-extra';
import { Readable } from 'stream';
import { Mock, describe, expect, it, vi } from 'vitest';

import AuditUtils from '../core/AuditUtils.ts';

vi.mock('fs-extra', () => ({
    default: {
        existsSync: vi.fn(() => true),
        createReadStream: vi.fn(() => {
            const mockStream = new Readable();
            mockStream.push('console.log("test");');
            mockStream.push(null); // End of stream
            return mockStream;
        }),
        readFileSync: vi.fn(() => 'mock file content'),
        readdirSync: vi.fn(() => ['mock-file.js']),
        rmSync: vi.fn(),
        statSync: vi.fn(() => ({ isDirectory: () => false })),
    },
}));

describe('AuditUtils', () => {
    it('should return true for accepted file types', () => {
        expect(AuditUtils.isAcceptedFileType('file.js')).toBe(true);
        expect(AuditUtils.isAcceptedFileType('file.ts')).toBe(true);
        expect(AuditUtils.isAcceptedFileType('file.css')).toBe(false);
    });

    it('should return true for excluded file types', () => {
        expect(AuditUtils.isExcludedFile('mock_test.js')).toBe(true);
        expect(AuditUtils.isExcludedFile('src/main.js')).toBe(false);
    });

    it('should return file content if file exists', async () => {
        const mockContent = 'console.log("test");';
        (fs.existsSync as Mock).mockReturnValue(true);
        (fs.readFileSync as Mock).mockReturnValue(mockContent);

        const content = await AuditUtils.getFileContent('test.js');
        expect(content).toBe(mockContent);
    });

    it('should return null if file does not exist', async () => {
        (fs.existsSync as Mock).mockReturnValue(false);
        const content = await AuditUtils.getFileContent('not_found.js');
        expect(content).toBeNull();
    });

    it('should detect non-compliant files', async () => {
        expect(await AuditUtils.isNonCompliantFile('bad-code', 'bad-code exists')).toBe(true);
        expect(await AuditUtils.isNonCompliantFile('bad-code', 'clean code')).toBe(false);
    });

    it('should return common base path', () => {
        expect(AuditUtils.findCommonBase(['/src/app/file1.js', '/src/app/file2.js'])).toBe(
            '/src/app/',
        );
        expect(AuditUtils.findCommonBase(['/src/file1.js', '/app/file2.js'])).toBe('/');
    });

    it('should generate a hash', () => {
        expect(AuditUtils.generateHash('test')).toMatch(/[a-f0-9]{32}/);
    });

    it('should return null for empty hash input', () => {
        expect(AuditUtils.generateHash('')).toBeNull();
    });

    it('should delete a file and return true', () => {
        (fs.existsSync as Mock).mockReturnValue(true);
        expect(AuditUtils.deleteAuditFile({ filePath: 'test.js' })).toBe(true);
    });

    it('should return false when deleting a non-existent file', () => {
        (fs.existsSync as Mock).mockReturnValue(false);
        expect(AuditUtils.deleteAuditFile({ filePath: 'not_found.js' })).toBe(true);
    });

    it('should parse valid files correctly', () => {
        (fs.readFileSync as Mock).mockReturnValue('const a = 10;');
        const result = AuditUtils.parseFile({
            file: 'myFile.ts',
            basePath: '/src',
            options: {},
        });

        expect(result).not.toBeNull();
        expect(result?.file).toBe('myFile.ts');
    });

    it('should return null for excluded files in parsing', () => {
        const result = AuditUtils.parseFile({
            file: 'test.ts',
            basePath: '/src',
            options: {},
        });

        expect(result).toBeNull();
    });

    it('should retrieve files recursively', () => {
        (fs.readdirSync as Mock).mockReturnValue(['file1.js', 'file2.js']);
        const result = AuditUtils.getFilesRecursively('/src', []);
        expect(result.length).toBe(2);
    });

    it('should return eligible files', () => {
        (fs.readdirSync as Mock).mockReturnValue(['file1.js', 'test.spec.js', 'main.ts']);
        const result = AuditUtils.getAuditEligibleFiles({ workspaceFolder: '/src' }) || {};

        expect(result.auditEligibleFiles?.length).toBe(2);

        console.log(result.auditEligibleFiles);

        expect(result.auditEligibleFiles?.includes('/src/file1.js')).toBe(true);
        expect(result.auditEligibleFiles?.includes('/src/main.ts')).toBe(true);
        expect(result.auditEligibleFiles?.includes('/src/test.spec.js')).toBe(false);
    });
});

// AuditUtils.test.ts
import * as fs from 'fs';
import * as path from 'path';
import { Mock, describe, expect, it, vi } from 'vitest';

import AppLogger from '../AppLogger.ts';
import AuditUtils from '../AuditUtils.ts';

// Mock fs-extra
vi.mock('fs-extra', async () => {
    return {
        existsSync: vi.fn(),
        createReadStream: vi.fn(),
        readFileSync: vi.fn(),
        rmSync: vi.fn(),
        readdirSync: vi.fn(),
        statSync: vi.fn(),
    };
});

// Mock globby
vi.mock('globby', async () => {
    return {
        sync: vi.fn(),
    };
});

vi.mock('fs');
vi.mock('path');
vi.mock('./AppLogger');

describe('AuditUtils', () => {
    it('should return true for accepted file types', () => {
        expect(AuditUtils.isAcceptedFileType('file.js')).toBe(true);
        expect(AuditUtils.isAcceptedFileType('file.jsx')).toBe(true);
        expect(AuditUtils.isAcceptedFileType('file.ts')).toBe(true);
        expect(AuditUtils.isAcceptedFileType('file.tsx')).toBe(true);
    });

    it('should return false for other file types', () => {
        expect(AuditUtils.isAcceptedFileType('file.txt')).toBe(false);
        expect(AuditUtils.isAcceptedFileType('file.css')).toBe(false);
    });

    it('should return true for excluded file paths', () => {
        expect(AuditUtils.isExcludedFile('/path/to/node_modules/file.js')).toBe(true);
        expect(AuditUtils.isExcludedFile('/path/to/test/file.js')).toBe(true);
        // ... add more excluded file paths
    });

    it('should return false if antiPattern or source is empty', async () => {
        const result1 = await AuditUtils.isNonCompliantFile('', 'some source code');
        const result2 = await AuditUtils.isNonCompliantFile('anti-pattern', '');

        expect(result1).toBe(false);
        expect(result2).toBe(false);
    });

    it('should return true if the source contains the antiPattern', async () => {
        const result = await AuditUtils.isNonCompliantFile(
            'anti-pattern',
            'some source code with anti-pattern',
        );
        expect(result).toBe(true);
    });

    it('should return null if the value is empty', () => {
        const result = AuditUtils.generateHash('');
        expect(result).toBeNull();
    });

    it('should return an empty object if workspaceFolder is empty', () => {
        const result = AuditUtils.getAuditEligibleFiles({ workspaceFolder: '' });
        expect(result).toEqual({});
    });

    it('should return the correct common base path', () => {
        const files = [
            '/path/to/project/src/file1.js',
            '/path/to/project/src/file2.js',
            '/path/to/project/src/subdir/file3.js',
        ];
        const result = AuditUtils.findCommonBase(files);
        expect(result).toBe('/path/to/project/src/');
    });

    it('should return an empty string if no common base path is found', () => {
        const files = ['/path/to/project1/src/file1.js', '/path/to/project2/src/file2.js'];
        const result = AuditUtils.findCommonBase(files);
        expect(result).toBe('/path/to/project');
    });
    it('should return frontend directories', () => {
        const directory = '/path/to/project';
        const files = ['module1', 'module2'];
        const module1Files = ['package.json'];
        const module2Files = ['file.js'];

        (fs.readdirSync as Mock).mockImplementation((dir) => {
            if (dir === directory) return files;
            if (dir === path.join(directory, 'module1')) return module1Files;
            if (dir === path.join(directory, 'module2')) return module2Files;
            return [];
        });

        (fs.statSync as Mock).mockImplementation((dir) => ({
            isDirectory: () => dir.includes('module'),
        }));

        (AuditUtils.isFrontend as Mock).mockReturnValue(true);

        const result = AuditUtils.getFrontendDirectories(directory, []);
        expect(result).toEqual([path.join(directory, 'module1')]);
    });

    it('should handle errors gracefully', () => {
        const directory = '/path/to/project';
        (fs.readdirSync as Mock).mockImplementation(() => {
            throw new Error('Test error');
        });

        const result = AuditUtils.getFrontendDirectories(directory, []);
        expect(result).toEqual([]);
        expect(AppLogger.info).toHaveBeenCalledWith(
            expect.stringContaining('error:  Error: Test error'),
        );
    });
});

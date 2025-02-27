// SemverUtils.test.ts
import { describe, expect, it } from 'vitest';

import SemverUtils from '../core/SemverUtils.ts';

describe('SemverUtils', () => {
    it('should compare versions correctly', () => {
        expect(SemverUtils.compareVersions('1.0.0', '1.0.1', '<')).toBe(true);
        expect(SemverUtils.compareVersions('1.0.0', '1.0.0', '=')).toBe(true);
        expect(SemverUtils.compareVersions('1.0.0', '1.0.0', '<=')).toBe(true);
        expect(SemverUtils.compareVersions('1.0.0', '1.0.0', '>=')).toBe(true);
        expect(SemverUtils.compareVersions('1.0.0', '2.0.0', '>')).toBe(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(SemverUtils.compareVersions('1.0.0', '1.0.1', '^')).toBe(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(SemverUtils.compareVersions('1.0.0', '1.1.0', '~')).toBe(false);
        expect(SemverUtils.compareVersions('1.2.3', '1.2.4', '>')).toBe(false);
    });

    it('should handle invalid versions gracefully', () => {
        expect(SemverUtils.compareVersions('invalid', '1.0.0', '=')).toBe(false);
        expect(SemverUtils.compareVersions('1.0.0', 'invalid', '<')).toBe(false);
    });

    it('should remove leading semver operators', () => {
        expect(SemverUtils.normalizeVersion('^1.0.0')).toBe('1.0.0');
        expect(SemverUtils.normalizeVersion('~1.0.0')).toBe('1.0.0');
        expect(SemverUtils.normalizeVersion('*1.0.0')).toBe('1.0.0');
    });

    it('should handle invalid versions gracefully', () => {
        expect(SemverUtils.normalizeVersion('invalid')).toBe(null);
    });

    it('should parse valid versions correctly', () => {
        const result = SemverUtils.parseVersion('^1.2.3');
        expect(result).toEqual({
            semverVersion: '1.2.3',
            semverVersionMajor: 1,
            semverVersionMinor: 2,
            semverVersionPatch: 3,
        });
    });

    it('should handle leading semver operators', () => {
        const result = SemverUtils.parseVersion('~1.2.3');
        expect(result).toEqual({
            semverVersion: '1.2.3',
            semverVersionMajor: 1,
            semverVersionMinor: 2,
            semverVersionPatch: 3,
        });
    });

    it('should return null for invalid versions', () => {
        const result = SemverUtils.parseVersion('invalid');
        expect(result).toBeNull();
    });
});

import { CompareOperator } from 'compare-versions';
/**
 * Type representing parsed semantic version details.
 */
interface ParsedVersion {
    semverVersion: string;
    semverVersionMajor: number;
    semverVersionMinor: number;
    semverVersionPatch: number;
}
/**
 * Utilities for working with semantic versions.
 */
declare const SemverUtils: {
    compareVersions: (version1: string, version2: string, operator: CompareOperator) => boolean;
    normalizeVersion: (version: string) => string | null;
    parseVersion: (version: string) => ParsedVersion | null;
};
export default SemverUtils;

import { compare } from 'compare-versions';
import { clean, major, minor, patch, valid } from 'semver';

import AppLogger from './AppLogger.js';

const SEMVER_OPERATORS = ['^', '~', '*', '='];

/**
 * Compares two semantic versions using the provided operator.
 *
 * @param {string} version1 - The first semantic version.
 * @param {string} version2 - The second semantic version.
 * @param {string} operator - The comparison operator (e.g., '>', '<', '=', '^', '~').
 * @returns {boolean} True if the comparison is successful, false otherwise.
 */
const compareVersions = (version1, version2, operator) => compare(version1, version2, operator);

/**
 * Normalizes a version string, removing any leading semver operators and cleaning the version.
 *
 * @param {string} version - The version string to normalize.
 * @returns {string|null} The normalized semantic version or null if an error occurs.
 */
const normalizeVersion = (version) => {
    try {
        if (version?.length) {
            let newVersion = '';
            if (SEMVER_OPERATORS.includes(version.trim().charAt(0))) {
                newVersion = version.slice(1);
            } else if (/^\d+$/.test(version.trim().charAt(0))) {
                newVersion = version;
            }

            // clean not work with range https://www.npmjs.com/package/semver
            const cleanedVersion = clean(newVersion.trim(), {
                loose: true,
            });

            // return valid semver version
            return valid(cleanedVersion);
        }
        return null;
    } catch (error) {
        AppLogger.info(`[normalizeVersion] error: ${error.message}`);
        return null;
    }
};

/**
 * Parses a version string and extracts major, minor, and patch components.
 *
 * @param {string} version - The version string to parse.
 * @returns {Object|null} An object containing the parsed version details or null if an error occurs.
 * The object will have the following properties:
 * - semverVersion: The valid semantic version.
 * - semverVersionMajor: The major version component.
 * - semverVersionMinor: The minor version component.
 * - semverVersionPatch: The patch version component.
 */
const parseVersion = (version) => {
    try {
        if (version?.length) {
            const validSemverVersion = normalizeVersion(version);
            if (!validSemverVersion) {
                return null;
            }

            return {
                semverVersion: validSemverVersion,
                semverVersionMajor: major(validSemverVersion),
                semverVersionMinor: minor(validSemverVersion),
                semverVersionPatch: patch(validSemverVersion),
            };
        }
        return null;
    } catch (error) {
        AppLogger.info(`[parseVersion] error: ${error.message}`);
        return null;
    }
};

/**
 * Utilities for working with semantic versions.
 */
const SemverUtils = {
    compareVersions,
    normalizeVersion,
    parseVersion,
};

export default SemverUtils;

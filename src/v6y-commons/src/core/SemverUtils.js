"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compare_versions_1 = require("compare-versions");
const semver_1 = require("semver");
const AppLogger_1 = __importDefault(require("./AppLogger"));
const SEMVER_OPERATORS = ['^', '~', '*', '='];
/**
 * Compares two semantic versions using the provided operator.
 *
 * @param {string} version1 - The first semantic version.
 * @param {string} version2 - The second semantic version.
 * @param {string} operator - The comparison operator (e.g., '>', '<', '=', '^', '~').
 * @returns {boolean} True if the comparison is successful, false otherwise.
 */
const compareVersions = (version1, version2, operator) => {
    try {
        AppLogger_1.default.info(`[compareVersions] version1: ${version1}`);
        AppLogger_1.default.info(`[compareVersions] version2: ${version2}`);
        AppLogger_1.default.info(`[compareVersions] operator: ${operator}`);
        return (0, compare_versions_1.compare)(version1, version2, operator);
    }
    catch (error) {
        AppLogger_1.default.info(`[compareVersions] error: ${error}`);
        return false;
    }
};
/**
 * Normalizes a version string, removing any leading semver operators and cleaning the version.
 *
 * @param {string} version - The version string to normalize.
 * @returns {string} The normalized semantic version or null if an error occurs.
 */
const normalizeVersion = (version) => {
    try {
        if (version?.length) {
            let newVersion = '';
            if (SEMVER_OPERATORS.includes(version.trim().charAt(0))) {
                newVersion = version.slice(1);
            }
            else if (/^\d+$/.test(version.trim().charAt(0))) {
                newVersion = version;
            }
            // clean not work with range https://www.npmjs.com/package/semver
            const cleanedVersion = (0, semver_1.clean)(newVersion.trim(), {
                loose: true,
            });
            // return valid semver version
            return (0, semver_1.valid)(cleanedVersion);
        }
        return '';
    }
    catch (error) {
        AppLogger_1.default.info(`[normalizeVersion] error: ${error}`);
        return '';
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
                semverVersionMajor: (0, semver_1.major)(validSemverVersion),
                semverVersionMinor: (0, semver_1.minor)(validSemverVersion),
                semverVersionPatch: (0, semver_1.patch)(validSemverVersion),
            };
        }
        return null;
    }
    catch (error) {
        AppLogger_1.default.info(`[parseVersion] error: ${error}`);
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
exports.default = SemverUtils;

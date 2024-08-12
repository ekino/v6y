import { compare } from 'compare-versions';
import { valid, clean, major, minor, patch } from 'semver';
import AppLogger from './AppLogger.js';

const SEMVER_OPERATORS = ['^', '~', '*', '='];

const compareVersions = (version1, version2, operator) => compare(version1, version2, operator);

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

const SemverUtils = {
    compareVersions,
    normalizeVersion,
    parseVersion,
};

export default SemverUtils;

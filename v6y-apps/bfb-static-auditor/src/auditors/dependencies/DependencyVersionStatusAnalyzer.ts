import {
    AppLogger,
    DeprecatedDependencyProvider,
    SemverUtils,
    dependencyVersionStatus,
} from '@v6y/core-logic';

import { DependencyAuditParamsType } from '../types/DependencyAuditType.ts';

const { compareVersions } = SemverUtils;

const NPM_REGISTRY_API = 'https://skimdb.npmjs.com/registry/';

/**
 * Get dependency registry infos
 * @param dependencyName
 */
const getDependencyRegistryInfos = async ({ dependencyName }: DependencyAuditParamsType) => {
    try {
        // https://skimdb.npmjs.com/registry/react-cookie
        // https://docs.npmjs.com/cli/v8/using-npm/registry
        const dependencyRegistryResponse = await fetch(
            `${NPM_REGISTRY_API}/${encodeURIComponent(dependencyName || '')}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            },
        );
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - getDependencyRegistryInfos] dependencyRegistryResponse:  ${dependencyRegistryResponse}`,
        );

        const dependencyRegistryJsonResponse = await dependencyRegistryResponse.json();
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - getDependencyRegistryInfos] dependencyRegistryJsonResponse:  ${dependencyRegistryJsonResponse}`,
        );

        return dependencyRegistryJsonResponse;
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - getDependencyRegistryInfos] error:  ${error}`,
        );
        return {};
    }
};

/**
 * Analyze dependency version status
 * @param dependencyName
 * @param dependencyVersion
 */
const analyzeDependencyVersionStatus = async ({
    dependencyName,
    dependencyVersion,
}: DependencyAuditParamsType) => {
    try {
        if (!dependencyVersion || !dependencyName) {
            return {};
        }

        const dependencyRegistryInfos = await getDependencyRegistryInfos({ dependencyName });
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - buildDependencyAuditReport] dependencyRegistryInfos:  ${dependencyRegistryInfos}`,
        );

        const recommendedVersion = dependencyRegistryInfos?.['dist-tags']?.latest;
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - buildDependencyAuditReport] recommendedVersion:  ${recommendedVersion}`,
        );

        const isOutDated = compareVersions(dependencyVersion, recommendedVersion, '<');
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - buildDependencyAuditReport] isOutDated:  ${isOutDated}`,
        );

        const deprecatedDependency =
            await DeprecatedDependencyProvider.getDeprecatedDependencyDetailsByParams({
                name: dependencyName,
            });
        const isDeprecated = deprecatedDependency?._id !== undefined || false;
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - buildDependencyAuditReport] isDeprecated:  ${isDeprecated}`,
        );

        let depStatus = dependencyVersionStatus['up-to-date'];
        if (isDeprecated) {
            depStatus = dependencyVersionStatus.deprecated;
        } else if (isOutDated) {
            depStatus = dependencyVersionStatus.outdated;
        }
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - buildDependencyAuditReport] depStatus:  ${depStatus}`,
        );

        return {
            depStatus,
            recommendedVersion,
        };
    } catch (error) {
        AppLogger.info(
            `[DependencyVersionStatusAnalyzer - getDependencyRegistryInfos] error:  ${error}`,
        );
        return {};
    }
};

const DependencyVersionStatusAnalyzer = {
    analyzeDependencyVersionStatus,
};

export default DependencyVersionStatusAnalyzer;

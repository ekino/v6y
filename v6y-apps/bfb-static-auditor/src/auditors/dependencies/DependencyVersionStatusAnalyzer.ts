import {
    AppLogger,
    DeprecatedDependencyProvider,
    RegistryManager,
    SemverUtils,
    dependencyVersionStatus,
} from '@v6y/core-logic';

import { DependencyAuditParamsType } from '../types/DependencyAuditType.ts';

const { compareVersions } = SemverUtils;
const { getPackageInfos } = RegistryManager;

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

        const dependencyRegistryInfos = await getPackageInfos({
            packageName: dependencyName,
            type: 'npm',
        });

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

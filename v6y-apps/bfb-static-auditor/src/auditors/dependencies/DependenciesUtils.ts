import { AppLogger, AuditUtils } from '@v6y/core-logic';

import { AuditCommonsType } from '../types/AuditCommonsType.ts';
import { DependencyAuditParamsType } from '../types/DependencyAuditType.ts';
import DependencySecurityAdvisoriesAnalyzer from './DependencySecurityAdvisoriesAnalyzer.js';
import DependencyVersionStatusAnalyzer from './DependencyVersionStatusAnalyzer.ts';

const { getFilesRecursively, getFileContent } = AuditUtils;
const { analyzeDependencyVersionStatus } = DependencyVersionStatusAnalyzer;
const { analyzeDependencySecurityAdvisories } = DependencySecurityAdvisoriesAnalyzer;

/**
 * Build dependency audit report
 * @param dependencyName
 * @param dependencyVersion
 * @param module
 */
const buildDependencyAuditReport = async ({
    dependencyName,
    dependencyVersion,
    module,
}: DependencyAuditParamsType) => {
    try {
        AppLogger.info(
            `[DependenciesUtils - buildDependencyAuditReport] dependencyName:  ${dependencyName}`,
        );
        AppLogger.info(
            `[DependenciesUtils - buildDependencyAuditReport] dependencyVersion:  ${dependencyVersion}`,
        );

        if (!dependencyVersion || !dependencyName) {
            return {};
        }

        const dependencyVersionStatus = await analyzeDependencyVersionStatus({
            dependencyName,
            dependencyVersion,
        });

        const dependencySecurityAdvisories = await analyzeDependencySecurityAdvisories({
            dependencyName,
            dependencyVersion,
        });

        return {
            module,
            type: 'frontend',
            name: dependencyName,
            version: dependencyVersion,
            recommendedVersion: dependencyVersionStatus?.recommendedVersion || dependencyVersion,
            status: dependencyVersionStatus?.depStatus,
            securityAdvisories: dependencySecurityAdvisories,
        };
    } catch (error) {
        AppLogger.info(`[DependenciesUtils - buildDependencyAuditReport] error:  ${error}`);
        return {};
    }
};

/**
 * Build module dependencies audit reports
 * @param dependencies
 * @param module
 */
const buildModuleDependenciesAuditReports = async ({
    dependencies,
    module,
}: DependencyAuditParamsType) => {
    try {
        AppLogger.info(
            `[DependenciesUtils - buildModuleDependenciesAuditReports] module:  ${module}`,
        );
        AppLogger.info(
            `[DependenciesUtils - buildModuleDependenciesAuditReports] dependencies:  ${
                Object.keys(dependencies || {})?.length
            }`,
        );

        if (!Object.keys(dependencies || {})?.length) {
            return [];
        }

        const dependenciesAuditReports = [];

        for (const dependencyName of Object.keys(dependencies || {})) {
            const dependencyAuditReport = await buildDependencyAuditReport({
                dependencyName: dependencyName,
                dependencyVersion: dependencies?.[dependencyName],
                module,
            });

            dependenciesAuditReports.push(dependencyAuditReport);
        }

        return dependenciesAuditReports;
    } catch (error) {
        AppLogger.info(`[DependenciesUtils - getDependenciesReference] error:  ${error}`);
        return [];
    }
};

/**
 * Format dependencies reports
 * @param application
 * @param workspaceFolder
 */
const formatDependenciesReports = async ({ application, workspaceFolder }: AuditCommonsType) => {
    try {
        AppLogger.info(
            `[DependenciesUtils - formatCodeModularityReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] application:  ${application}`,
        );

        if (!application || !workspaceFolder) {
            return [];
        }

        const packagesJsonFilePaths = getFilesRecursively(workspaceFolder, [])?.filter(
            (file: string) => file.includes('package.json'),
        );
        AppLogger.info(
            `[CodeDuplicationUtils - formatCodeDuplicationReports] packagesJsonFilePaths:  ${packagesJsonFilePaths?.length}`,
        );

        if (!packagesJsonFilePaths?.length) {
            return [];
        }

        const dependenciesAuditReports = [];

        const module = {
            appId: application?._id,
            url: application?.repo?.webUrl,
            branch: workspaceFolder.split('/').pop(),
            path: '',
        };

        for (const packagesJsonFilePath of packagesJsonFilePaths) {
            const fileContent = await getFileContent(packagesJsonFilePath);
            AppLogger.info(
                `[DependenciesUtils - formatCodeModularityReports] fileContent:  ${fileContent}`,
            );

            if (!fileContent?.length) {
                continue;
            }

            const fileJsonContent = JSON.parse(fileContent);
            AppLogger.info(
                `[DependenciesUtils - formatCodeModularityReports] fileJsonContent:  ${fileJsonContent}`,
            );

            if (!Object.keys(fileJsonContent || {})?.length) {
                continue;
            }

            const { devDependencies, dependencies } = fileJsonContent;
            const mergedDependencies = {
                ...(devDependencies || {}),
                ...(dependencies || {}),
            };
            AppLogger.info(
                `[DependenciesUtils - formatCodeModularityReports] mergedDependencies:  ${
                    Object.keys(mergedDependencies || {})?.length
                }`,
            );

            if (!Object.keys(mergedDependencies || {})?.length) {
                continue;
            }

            const moduleDependenciesAuditReports = await buildModuleDependenciesAuditReports({
                dependencies: mergedDependencies,
                module: {
                    ...module,
                    path: packagesJsonFilePath,
                },
            });
            AppLogger.info(
                `[DependenciesUtils - formatCodeModularityReports] moduleDependenciesAuditReports:  ${moduleDependenciesAuditReports?.length}`,
            );

            dependenciesAuditReports.push(...(moduleDependenciesAuditReports || []));
        }

        return dependenciesAuditReports;
    } catch (error) {
        AppLogger.info(`[DependenciesUtils - formatCodeModularityReports] error:  ${error}`);
        return [];
    }
};

const DependenciesUtils = {
    formatDependenciesReports,
};

export default DependenciesUtils;

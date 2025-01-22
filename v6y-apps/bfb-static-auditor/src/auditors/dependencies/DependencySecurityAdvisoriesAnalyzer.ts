import {
    AppLogger,
    DependencySecurityAdvisoriesType,
    RegistryManager,
    SemverUtils,
} from '@v6y/core-logic';

import { DependencyAuditParamsType } from '../types/DependencyAuditType.js';

const { getRepositorySecurityAdvisories } = RegistryManager;
const { normalizeVersion } = SemverUtils;

const analyzeDependencySecurityAdvisories = async ({
    dependencyName,
    dependencyVersion,
}: DependencyAuditParamsType): Promise<DependencySecurityAdvisoriesType[] | null> => {
    try {
        AppLogger.info(
            `[DependencySecurityAdvisoriesAnalyzer - analyzeDependencySecurityAdvisories] dependencyName:  ${dependencyName}`,
        );
        AppLogger.info(
            `[DependencySecurityAdvisoriesAnalyzer - analyzeDependencySecurityAdvisories] dependencyVersion:  ${dependencyVersion}`,
        );

        const normalizedDependencyVersion = normalizeVersion(dependencyVersion || '');
        AppLogger.info(
            `[DependencySecurityAdvisoriesAnalyzer - analyzeDependencySecurityAdvisories] normalizedDependencyVersion:  ${normalizedDependencyVersion}`,
        );

        if (!normalizedDependencyVersion?.length || !dependencyName?.length) {
            return [];
        }

        //https://api.github.com/advisories?per_page=100&ecosystem=npm&affects=next@14.2.8
        const dependencySecurityAdvisories = await getRepositorySecurityAdvisories({
            pageSize: '100',
            affectedModule: `${dependencyName}@${normalizedDependencyVersion}`,
            type: 'github',
        });

        AppLogger.info(
            `[DependencySecurityAdvisoriesAnalyzer - analyzeDependencySecurityAdvisories] dependencySecurityAdvisories:  ${dependencySecurityAdvisories?.length}`,
        );

        return dependencySecurityAdvisories;
    } catch (error) {
        AppLogger.info(
            `[DependencySecurityAdvisoriesAnalyzer - analyzeDependencySecurityAdvisories] error:  ${error}`,
        );
        return [];
    }
};

const DependencySecurityAdvisoriesAnalyzer = {
    analyzeDependencySecurityAdvisories,
};

export default DependencySecurityAdvisoriesAnalyzer;

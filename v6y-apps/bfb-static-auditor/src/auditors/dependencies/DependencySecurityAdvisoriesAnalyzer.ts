import { AppLogger, DependencySecurityAdvisoriesType, RegistryManager } from '@v6y/core-logic';

import { DependencyAuditParamsType } from '../types/DependencyAuditType.js';

const { getRepositorySecurityAdvisories } = RegistryManager;

const analyzeDependencySecurityAdvisories = async ({
    dependencyName,
    dependencyVersion,
}: DependencyAuditParamsType): Promise<DependencySecurityAdvisoriesType[] | null> => {
    try {
        //https://api.github.com/advisories?per_page=100&ecosystem=npm&affects=next@14.2.8
        const dependencySecurityAdvisories = await getRepositorySecurityAdvisories({
            pageSize: '100',
            affectedModule: `${dependencyName}@${dependencyVersion}`,
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

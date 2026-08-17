import { DependencyType } from '@v6y/core-logic/src/types';

import { classifyDependencyStatus } from './StatusUtils';

interface DependencyAuditSummary {
    dependencies: DependencyType[];
    allDependenciesUpToDate: boolean;
}

// Delegates to the shared classifier so this stays in sync with the status
// colors/counts derived elsewhere (StatusUtils.ts, VitalityDependenciesSummary.tsx).
const isDependencyUpToDate = (status?: string): boolean =>
    classifyDependencyStatus(status) === 'success';

/**
 * Builds the dependency table content: keeps only outdated dependencies with
 * a documented status help, merged with that help. Also flags the case where
 * every dependency is up to date (nothing to show, but not empty state).
 */
const summarizeDependenciesAudit = (allDependencies: DependencyType[]): DependencyAuditSummary => {
    const dependencies = allDependencies
        .filter((dependency) => dependency?.statusHelp?.category && dependency?.statusHelp?.title)
        .filter((dependency) => !isDependencyUpToDate(dependency.status))
        .map((dependency) => ({
            ...dependency,
            ...dependency.statusHelp,
            status: dependency.status,
        }));

    const hasUpToDateDependency = allDependencies.some((dependency) =>
        isDependencyUpToDate(dependency.status),
    );

    return {
        dependencies,
        allDependenciesUpToDate:
            allDependencies.length > 0 && dependencies.length === 0 && hasUpToDateDependency,
    };
};

const getDependencyLocationText = (dependency: DependencyType): string => {
    return [dependency.module?.branch, dependency.module?.path].filter(Boolean).join(' - ');
};

export { getDependencyLocationText, summarizeDependenciesAudit };

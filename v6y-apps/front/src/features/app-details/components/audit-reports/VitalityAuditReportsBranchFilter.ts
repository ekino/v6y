import { AuditType } from '@v6y/core-logic/src/types';

const normalizeBranch = (branch?: string): string => {
    if (!branch) {
        return '';
    }

    return branch.replace(/^refs\/heads\//i, '').trim().toLowerCase();
};

const escapeRegExp = (value: string): string => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const matchesBranchAlias = (reportBranch: string, alias: string): boolean => {
    if (!alias) {
        return false;
    }

    if (reportBranch === alias) {
        return true;
    }

    // Some analyzers prefix the branch with project/workspace name (e.g. my-app-main).
    const aliasSuffixPattern = new RegExp(`(?:^|[-_/])${escapeRegExp(alias)}$`);
    return aliasSuffixPattern.test(reportBranch);
};

const getSelectedBranchAliases = (selectedBranch?: string): string[] => {
    const normalizedSelectedBranch = normalizeBranch(selectedBranch);

    if (!normalizedSelectedBranch) {
        return [];
    }

    const aliases = new Set<string>();
    aliases.add(normalizedSelectedBranch);

    aliases.add(normalizedSelectedBranch.replaceAll('/', '-'));

    const selectedBranchTail = normalizedSelectedBranch.split('/').pop();
    if (selectedBranchTail) {
        aliases.add(selectedBranchTail);
    }

    return Array.from(aliases);
};

const matchesReportBranchWithSelectedBranch = (
    reportBranch?: string,
    selectedBranch?: string,
): boolean => {
    const selectedBranchAliases = getSelectedBranchAliases(selectedBranch);

    if (!selectedBranchAliases.length) {
        return true;
    }

    const normalizedReportBranch = normalizeBranch(reportBranch);

    if (!normalizedReportBranch) {
        return false;
    }

    return selectedBranchAliases.some((alias) => matchesBranchAlias(normalizedReportBranch, alias));
};

const matchesAuditReportBranch = (
    report: AuditType,
    selectedBranch?: string,
): boolean => {
    return matchesReportBranchWithSelectedBranch(report.module?.branch, selectedBranch);
};

export { matchesAuditReportBranch, matchesReportBranchWithSelectedBranch };

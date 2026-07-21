import { AuditType } from '@v6y/core-logic/src/types';

type AuditReportCategory =
    | 'performance'
    | 'maintainability'
    | 'accessibility'
    | 'security'
    | 'dora'
    | 'greenIndex';

/**
 * Security-smell reports are static audit reports whose category matches one
 * of the known smell-detector prefixes, or are flagged as Code-Security.
 */
const isSecuritySmell = (report: AuditType): boolean => {
    const categoryLower = report.category?.toLowerCase() || '';
    return (
        categoryLower.startsWith('commons-') ||
        categoryLower.startsWith('react-') ||
        categoryLower.startsWith('angular-') ||
        report.type === 'Code-Security'
    );
};

const isLighthouseReport = (report: AuditType): boolean => report.type === 'Lighthouse';

const isAccessibilityReport = (report: AuditType): boolean =>
    (report.category?.toLowerCase() || '').includes('accessibility');

const staticReportFiltersByCategory: Record<AuditReportCategory, (report: AuditType) => boolean> = {
    performance: (report) => {
        const category = report.category?.toLowerCase() || '';
        const type = report.type?.toLowerCase() || '';
        return (
            report.type !== 'Code-Complexity' &&
            report.type !== 'Code-Coupling' &&
            report.type !== 'Code-Security' &&
            report.type !== 'Dependencies' &&
            report.type !== 'Code-Duplication' &&
            report.type !== 'DORA' &&
            report.type !== 'Ecological-Impact' &&
            report.type !== 'Green-Hosting' &&
            report.type !== 'Ecoindex' &&
            !category.includes('maintainability') &&
            !category.includes('modularity') &&
            !category.includes('duplication') &&
            !category.includes('accessibility') &&
            !type.includes('accessibility') &&
            !isSecuritySmell(report)
        );
    },
    maintainability: (report) => {
        const category = report.category?.toLowerCase() || '';
        return (
            report.type === 'Code-Complexity' ||
            report.type === 'Code-Coupling' ||
            category.includes('maintainability') ||
            category.includes('modularity') ||
            category.includes('coupling') ||
            category.includes('duplication')
        );
    },
    accessibility: (report) => {
        const category = report.category?.toLowerCase() || '';
        const type = report.type?.toLowerCase() || '';
        return (
            (category.includes('accessibility') || type.includes('accessibility')) &&
            !category.includes('performance') &&
            !category.includes('seo')
        );
    },
    security: isSecuritySmell,
    dora: (report) => report.type === 'DORA',
    greenIndex: (report) =>
        report.type === 'Ecological-Impact' ||
        report.type === 'Green-Hosting' ||
        report.type === 'Ecoindex',
};

const isAuditReportCategory = (value?: string): value is AuditReportCategory =>
    !!value && value in staticReportFiltersByCategory;

/**
 * Splits audit reports into static/dynamic (Lighthouse) buckets, applies the
 * category filter to static reports, then re-attaches the Lighthouse reports
 * relevant to that category (performance or accessibility).
 */
const filterAuditReportsByCategory = (
    auditReports: AuditType[],
    category?: string,
): AuditType[] => {
    const staticAuditReports = auditReports.filter((report) => !isLighthouseReport(report));
    const dynamicAuditReports = auditReports.filter(isLighthouseReport);

    const categoryFilter = isAuditReportCategory(category)
        ? staticReportFiltersByCategory[category]
        : undefined;
    const filteredStaticAuditReports = categoryFilter
        ? staticAuditReports.filter(categoryFilter)
        : staticAuditReports;

    if (category === 'performance') {
        const performanceDynamicReports = dynamicAuditReports.filter(
            (report) => !isAccessibilityReport(report),
        );
        return [...filteredStaticAuditReports, ...performanceDynamicReports];
    }

    if (category === 'accessibility') {
        const accessibilityDynamicReports = dynamicAuditReports.filter(isAccessibilityReport);
        return [...filteredStaticAuditReports, ...accessibilityDynamicReports];
    }

    return filteredStaticAuditReports;
};

export { filterAuditReportsByCategory, isSecuritySmell };

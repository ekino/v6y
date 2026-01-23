import { AuditType } from '@v6y/core-logic/src/types';

interface CategorizedReports {
    static: AuditType[];
    dynamic: AuditType[];
    devops: AuditType[];
}

export const categorizeAuditReports = (auditReports: AuditType[]): CategorizedReports => {
    const categorized: CategorizedReports = {
        static: [],
        dynamic: [],
        devops: [],
    };

    auditReports.forEach((report) => {
        const category = report.category?.toLowerCase();

        if (
            category?.includes('security') ||
            category?.includes('quality') ||
            category?.includes('maintainability') ||
            category?.includes('complexity') ||
            category?.includes('duplication') ||
            category?.includes('coupling')
        ) {
            categorized.static.push(report);
        } else if (
            category?.includes('performance') ||
            category?.includes('accessibility') ||
            category?.includes('runtime')
        ) {
            categorized.dynamic.push(report);
        } else if (
            category?.includes('dora') ||
            category?.includes('deployment') ||
            category?.includes('lead') ||
            category?.includes('frequency') ||
            category?.includes('failure') ||
            category?.includes('restore') ||
            category?.includes('up') ||
            category?.includes('change')
        ) {
            categorized.devops.push(report);
        } else {
            categorized.static.push(report);
        }
    });

    return categorized;
};

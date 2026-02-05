import { AuditType } from '@v6y/core-logic/src/types';

interface CategorizedReports {
    static: AuditType[];
    dynamic: AuditType[];
    devops: AuditType[];
}

const auditTypeMap: Record<string, keyof CategorizedReports> = {
    Lighthouse: 'dynamic',

    'Code-Complexity': 'static',
    'Code-Security': 'static',
    'Code-Duplication': 'static',
    'Code-Coupling': 'static',
    'Code-Modularity': 'static',
    Dependencies: 'static',
    'Bundle-Analysis': 'static',

    DORA: 'devops',
    DevOps: 'devops',
};

const getCategoryByType = (type: string): keyof CategorizedReports => {
    const mappedCategory = auditTypeMap[type];
    if (mappedCategory) {
        return mappedCategory;
    }

    const lowerType = type.toLowerCase();
    if (lowerType.includes('lighthouse') || lowerType.includes('dynamic')) {
        return 'dynamic';
    }
    if (lowerType.includes('dora') || lowerType.includes('devops')) {
        return 'devops';
    }

    return 'static';
};

export const categorizeAuditReports = (auditReports: AuditType[]): CategorizedReports => {
    const categorized: CategorizedReports = {
        static: [],
        dynamic: [],
        devops: [],
    };

    auditReports.forEach((report) => {
        const category = getCategoryByType(report.type || '');
        categorized[category].push(report);
    });

    return categorized;
};

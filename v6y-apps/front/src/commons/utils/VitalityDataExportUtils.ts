import {
    ApplicationType,
    AuditType,
    CsvUtils,
    DependencyType,
    EvolutionType,
    KeywordType,
} from '@v6y/core-logic';

const { exportDataToCSV } = CsvUtils;

export const exportAppListDataToCSV = (appList: ApplicationType[]) =>
    exportDataToCSV({ data: appList, baseName: 'VitalityAppList' });
export const exportAppDetailsDataToCSV = (appDetails: ApplicationType) =>
    exportDataToCSV({ data: [appDetails], baseName: 'VitalityAppDetails' });
export const exportAppQualityIndicatorsToCSV = (indicators: KeywordType[]) =>
    exportDataToCSV({ data: indicators, baseName: 'VitalityAppQualityIndicators' });
export const exportAppEvolutionsToCSV = (evolutions: EvolutionType[]) =>
    exportDataToCSV({ data: evolutions, baseName: 'VitalityAppEvolutions' });
export const exportAppDependenciesToCSV = (dependencies: DependencyType[]) =>
    exportDataToCSV({ data: dependencies, baseName: 'VitalityAppDependencies' });
export const exportAppAuditReportsToCSV = (auditReports: AuditType[]) =>
    exportDataToCSV({ data: auditReports, baseName: 'VitalityAppAuditReports' });

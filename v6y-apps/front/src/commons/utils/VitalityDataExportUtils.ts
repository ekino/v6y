import { ApplicationType } from '@v6y/core-logic/src/types/ApplicationType';
import { AuditType } from '@v6y/core-logic/src/types/AuditType';
import { DependencyType } from '@v6y/core-logic/src/types/DependencyType';
import { EvolutionType } from '@v6y/core-logic/src/types/EvolutionType';
import { KeywordType } from '@v6y/core-logic/src/types/KeywordType';
import { CsvUtils } from '@v6y/core-logic/src/utils';

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

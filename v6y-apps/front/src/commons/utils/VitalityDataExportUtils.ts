import {
    ApplicationType,
    AuditType,
    DependencyType,
    EvolutionType,
    KeywordType,
} from '@v6y/core-logic/src/types';
import { CsvUtils } from '@v6y/core-logic/src/utils';

const { exportDataToCSV } = CsvUtils;

export const exportAppListDataToCSV = (appList: ApplicationType[]) =>
    exportDataToCSV({ data: appList, baseName: 'VitalityAppList' });
export const exportAppDetailsDataToCSV = (appDetails: ApplicationType) =>
    exportDataToCSV({ data: [appDetails], baseName: 'VitalityAppDetails' });

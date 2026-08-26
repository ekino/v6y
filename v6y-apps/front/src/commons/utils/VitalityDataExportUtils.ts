import { ApplicationType } from '@v6y/core-logic/src/types';
import { CsvUtils } from '@v6y/core-logic/src/utils';

const { exportDataToCSV } = CsvUtils;

export const exportAppDetailsDataToCSV = (appDetails: ApplicationType) =>
    exportDataToCSV({ data: [appDetails], baseName: 'VitalityAppDetails' });

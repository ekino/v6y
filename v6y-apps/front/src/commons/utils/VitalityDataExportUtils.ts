import {
    ApplicationType,
    AuditType,
    DependencyType,
    EvolutionType,
    KeywordType,
} from '@v6y/core-logic';
import FileSaver from 'file-saver';
import { json2csv } from 'json-2-csv';
import { Json2CsvOptions } from 'json-2-csv/lib/types';

interface ExportDataToCSVProps {
    data: ApplicationType[] | KeywordType[] | EvolutionType[] | DependencyType[] | AuditType[];
    baseName: string;
}

const EXPORT_CSV_OPTIONS: Json2CsvOptions = {
    delimiter: {
        field: ';',
    },
    excludeKeys: ['_id', 'repo._id'],
    unwindArrays: false,
};

const buildCSVFileName = (baseName: string) => {
    const todayDate = new Date();
    const month = todayDate.getUTCMonth() + 1; // months from 1-12
    const day = todayDate.getUTCDate();
    const year = todayDate.getUTCFullYear();
    return `${baseName}_${year}_${month}_${day}.csv`;
};

const exportDataToCSV = ({ data, baseName }: ExportDataToCSVProps): boolean => {
    try {
        if (!data?.length) {
            return false;
        }

        const csvData = json2csv(data, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName(baseName));

        return true;
    } catch {
        return false;
    }
};

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

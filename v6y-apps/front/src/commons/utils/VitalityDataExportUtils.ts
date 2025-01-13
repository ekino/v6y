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

export const exportAppListDataToCSV = (appList: ApplicationType[]) => {
    try {
        if (!appList?.length) {
            return false;
        }

        const csvData = json2csv(appList, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppList'));

        return true;
    } catch {
        return false;
    }
};

export const exportAppDetailsDataToCSV = (appDetails: ApplicationType) => {
    try {
        if (!appDetails) {
            return false;
        }

        const csvData = json2csv([appDetails], EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppDetails'));

        return true;
    } catch {
        return false;
    }
};

export const exportAppQualityIndicatorsToCSV = (indicators: KeywordType[]) => {
    try {
        if (!indicators?.length) {
            return false;
        }

        const csvData = json2csv(indicators, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppDetails'));

        return true;
    } catch {
        return false;
    }
};

export const exportAppEvolutionsToCSV = (evolutions: EvolutionType[]) => {
    try {
        if (!evolutions?.length) {
            return false;
        }

        const csvData = json2csv(evolutions, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppDetails'));

        return true;
    } catch {
        return false;
    }
};

export const exportAppDependenciesToCSV = (dependencies: DependencyType[]) => {
    try {
        if (!dependencies?.length) {
            return false;
        }

        const csvData = json2csv(dependencies, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppDetails'));

        return true;
    } catch {
        return false;
    }
};

export const exportAppAuditReportsToCSV = (auditReports: AuditType[]) => {
    try {
        if (!auditReports?.length) {
            return false;
        }

        const csvData = json2csv(auditReports, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppDetails'));

        return true;
    } catch {
        return false;
    }
};

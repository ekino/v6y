import FileSaver from 'file-saver';
import { json2csv } from 'json-2-csv';

const EXPORT_CSV_OPTIONS = {
    delimiter: {
        filed: ';',
    },
    excludeKeys: ['_id', 'repo._id'],
    unwindArrays: false,
};

const buildCSVFileName = (baseName) => {
    const todayDate = new Date();
    const month = todayDate.getUTCMonth() + 1; // months from 1-12
    const day = todayDate.getUTCDate();
    const year = todayDate.getUTCFullYear();
    return `${baseName}_${year}_${month}_${day}.csv`;
};

export const exportAppListDataToCSV = ({ appList = [] }) => {
    try {
        if (!appList?.length) {
            return false;
        }

        const csvData = json2csv(appList, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppList'));

        return true;
    } catch (error) {
        return false;
    }
};

export const exportAppDetailsDataToCSV = ({ appDetails }) => {
    try {
        if (!appDetails) {
            return false;
        }

        const csvData = json2csv(appDetails, EXPORT_CSV_OPTIONS);
        const csvBlob = new Blob([csvData], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(csvBlob, buildCSVFileName('VitalityAppDetails'));

        return true;
    } catch (error) {
        return false;
    }
};

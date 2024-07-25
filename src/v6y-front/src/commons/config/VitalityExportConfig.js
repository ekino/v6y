import { json2csv } from 'json-2-csv';

const EXPORT_CSV_OPTIONS = {
    delimiter: {
        filed: ';',
    },
    expandNestedObjects: true,
    expandArrayObjects: false,
    unwindArrays: false,
};

const buildCSVFileName = (baseName) => {
    const todayDate = new Date();
    const month = todayDate.getUTCMonth() + 1; // months from 1-12
    const day = todayDate.getUTCDate();
    const year = todayDate.getUTCFullYear();
    return `${baseName}_${year}_${month}_${day}.csv`;
};

const exportCSVData = ({ data, open, fileName }) => {
    try {
        if (data && data.length) {
            const csvData = json2csv(data, EXPORT_CSV_OPTIONS);

            if (open) {
                openFile(csvData, buildCSVFileName(fileName));
            }

            return csvData;
        }
        return null;
    } catch (error) {
        return null;
    }
};

const exportAppListDataToCSV = ({ data, open }) =>
    exportCSVData({
        data,
        open,
        fileName: buildCSVFileName('VITALITY_APP_LIST'),
    });

const exportAppDetailsDataToCSV = ({ appDetails, open }) =>
    exportCSVData({
        data: [appDetails],
        open,
        fileName: buildCSVFileName('VITALITY_APP_DETAILS'),
    });

const VitalityExportConfig = {
    exportAppListDataToCSV,
    exportAppDetailsDataToCSV,
};

export default VitalityExportConfig;

import FileSaver from 'file-saver';
import { Json2CsvOptions, json2csv } from 'json-2-csv';

import { ApplicationType } from '../types/ApplicationType.ts';
import { AuditType } from '../types/AuditType.ts';
import { DependencyType } from '../types/DependencyType.ts';
import { EvolutionType } from '../types/EvolutionType.ts';
import { KeywordType } from '../types/KeywordType.ts';

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

const CsvUtils = {
    exportDataToCSV,
};

export default CsvUtils;

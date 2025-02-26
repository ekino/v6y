type DateStringFormatType = 'YYYY-MM-DD' | 'ISO';

const formatDateToString = (date: Date, format?: DateStringFormatType): string => {
    if (!format) {
        format = 'ISO';
    }
    switch (format) {
        case 'YYYY-MM-DD':
            return date.toISOString().split('T')[0];
        case 'ISO':
            return date.toISOString();
        default:
            throw new Error(`Invalid date format: ${format}`);
    }
};

const formatStringToDate = (dateStr: string): Date => {
    return new Date(dateStr);
};

const DateUtils = {
    formatDateToString,
    formatStringToDate,
};

export default DateUtils;

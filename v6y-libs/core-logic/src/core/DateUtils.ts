/**
 * Type representing the supported date string formats.
 * - 'YYYY-MM-DD': Date formatted as 'YYYY-MM-DD'.
 * - 'ISO': Date formatted as ISO string.
 */
type DateStringFormatType = 'YYYY-MM-DD' | 'ISO';

/**
 * Formats a Date object to a string based on the specified format.
 *
 * @param date - The Date object to format.
 * @param format - The format to use for the date string. Defaults to 'ISO'.
 */
const formatDateToString = (date: Date, format: DateStringFormatType = 'ISO'): string => {
    switch (format) {
        case 'YYYY-MM-DD':
            return date.toISOString().split('T')[0];
        case 'ISO':
            return date.toISOString();
        default:
            throw new Error(`Invalid date format: ${format}`);
    }
};

/**
 * Parses a date string into a Date object.
 *
 * @param dateStr - The date string to parse.
 */
const formatStringToDate = (dateStr: string): Date => {
    return new Date(dateStr);
};

/**
 * DateUtils module providing utility functions for date formatting and parsing.
 */
const DateUtils = {
    formatDateToString,
    formatStringToDate,
};

export default DateUtils;

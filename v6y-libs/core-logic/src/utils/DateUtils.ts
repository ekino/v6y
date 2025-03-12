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
 * Type representing the supported timestamp units.
 * - 'ms': Milliseconds.
 * - 's': Seconds.
 */
type TimeStampUnit = 'ms' | 's';

/**
 * Converts a Date object to a timestamp.
 *
 * @param date - The Date object to convert.
 */
const formatDateToTimestamp = (date: Date, unit: TimeStampUnit = 's'): number => {
    const timestamp = date.getTime(); // in milliseconds
    switch (unit) {
        case 'ms':
            return timestamp;
        case 's':
            return Math.floor(timestamp / 1000);
        default:
            throw new Error(`Invalid timestamp unit: ${unit}`);
    }
};

/**
 * Parses a integer timestamp into a Date object.
 *
 * @param timestamp - The timestamp to parse.
 */
const formatTimestampToDate = (timestamp: number, unit: TimeStampUnit = 's'): Date => {
    switch (unit) {
        case 'ms':
            return new Date(timestamp);
        case 's':
            return new Date(timestamp * 1000);
        default:
            throw new Error(`Invalid timestamp unit: ${unit}`);
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
 * Parses a date string into a timestamp.
 *
 * @param dateStr - The date string to parse.
 */
const formatStringToTimeStamp = (dateStr: string, unit: TimeStampUnit = 's'): number => {
    return formatDateToTimestamp(formatStringToDate(dateStr), unit);
};

/**
 * DateUtils module providing utility functions for date formatting and parsing.
 */
const DateUtils = {
    formatDateToString,
    formatStringToDate,
    formatDateToTimestamp,
    formatTimestampToDate,
    formatStringToTimeStamp,
};

export default DateUtils;

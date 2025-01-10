import AppLogger from './AppLogger.ts';

/**
 * encode value to base 64
 * @param {string} value
 * @return {string}
 */
const encodeBase64 = (value: string): string => {
    try {
        if (value?.length) {
            const valueBuffer = Buffer.from(value);
            return valueBuffer ? valueBuffer.toString('base64') : '';
        }
        return '';
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        AppLogger.info(`[encodeBase64] error: ${errorMessage}`);
        return '';
    }
};

/**
 * decode value from base 64
 * @param {string} value
 * @return {string}
 */
const decodeBase64 = (value: string): string => {
    try {
        if (value?.length) {
            const valueBuffer = Buffer.from(value, 'base64');
            return valueBuffer ? valueBuffer.toString('ascii') : '';
        }
        return '';
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        AppLogger.info(`[decodeBase64] error: ${errorMessage}`);
        return '';
    }
};

/**
 * Parse string and convert it to Javascript type
 * @param value
 */
const parseJsonString = (value: string) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        AppLogger.info(`[parseJsonString] error: ${error}`);
        return null;
    }
};

/**
 * Parse encoded string and convert it to Javascript type
 * @param value
 */
const parseEncodedJsonString = (value: string) => {
    try {
        return parseJsonString(decodeBase64(value));
    } catch (error) {
        AppLogger.info(`[parseEncodedJsonString] error: ${error}`);
        return null;
    }
};

const StringUtils = {
    encodeBase64,
    decodeBase64,
    parseJsonString,
    parseEncodedJsonString,
};

export default StringUtils;

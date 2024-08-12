import AppLogger from './AppLogger.js';

/**
 * encode value to base 64
 * @param {string} value
 * @return {string|null}
 */
const encodeBase64 = (value) => {
    try {
        if (value && value.length) {
            const valueBuffer = Buffer.from(value);
            return valueBuffer ? valueBuffer.toString('base64') : '';
        }
        return '';
    } catch (error) {
        AppLogger.info(`[encodeBase64] error: ${error.message}`);
        return '';
    }
};

/**
 * decode value from base 64
 * @param {string} value
 * @return {string|null}
 */
const decodeBase64 = (value) => {
    try {
        if (value && value.length) {
            const valueBuffer = Buffer.from(value, 'base64');
            return valueBuffer ? valueBuffer.toString('ascii') : '';
        }
        return '';
    } catch (error) {
        AppLogger.info(`[decodeBase64] error: ${error.message}`);
        return '';
    }
};

/**
 * Parse string and convert it to Javascript type
 * @param {string} value
 * @return {any|null}
 */
const parseJsonString = (value) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        AppLogger.info(`[parseJsonString] error: ${error.message}`);
        return null;
    }
};

/**
 * Parse encoded base 64 string and convert it to Javascript type
 * @param {string} value
 * @return {any|null}
 */
const parseEncodedJsonString = (value) => {
    try {
        return parseJsonString(decodeBase64(value));
    } catch (error) {
        AppLogger.info(`[parseEncodedJsonString] error: ${error.message}`);
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

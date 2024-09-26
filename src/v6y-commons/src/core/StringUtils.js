"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("./AppLogger"));
/**
 * encode value to base 64
 * @param {string} value
 * @return {string}
 */
const encodeBase64 = (value) => {
    try {
        if (value && value.length) {
            const valueBuffer = Buffer.from(value);
            return valueBuffer ? valueBuffer.toString('base64') : '';
        }
        return '';
    }
    catch (error) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        AppLogger_1.default.info(`[encodeBase64] error: ${error.message}`);
        return '';
    }
};
/**
 * decode value from base 64
 * @param {string} value
 * @return {string}
 */
const decodeBase64 = (value) => {
    try {
        if (value && value.length) {
            const valueBuffer = Buffer.from(value, 'base64');
            return valueBuffer ? valueBuffer.toString('ascii') : '';
        }
        return '';
    }
    catch (error) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        AppLogger_1.default.info(`[decodeBase64] error: ${error.message}`);
        return '';
    }
};
/**
 * Parse string and convert it to Javascript type
 * @param value
 */
const parseJsonString = (value) => {
    try {
        return JSON.parse(value);
    }
    catch (error) {
        AppLogger_1.default.info(`[parseJsonString] error: ${error}`);
        return null;
    }
};
/**
 * Parse encoded string and convert it to Javascript type
 * @param value
 */
const parseEncodedJsonString = (value) => {
    try {
        return parseJsonString(decodeBase64(value));
    }
    catch (error) {
        AppLogger_1.default.info(`[parseEncodedJsonString] error: ${error}`);
        return null;
    }
};
const StringUtils = {
    encodeBase64,
    decodeBase64,
    parseJsonString,
    parseEncodedJsonString,
};
exports.default = StringUtils;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("./AppLogger"));
/**
 * Starts a performance measurement by creating a 'start' mark.
 *
 * @param {string} measureName - The name of the performance measurement.
 */
const startMeasure = (measureName) => {
    try {
        performance.mark(`${measureName}-start`);
    }
    catch (error) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        AppLogger_1.default.info(`Error starting performance measurement: ${error.message}`);
    }
};
/**
 * Ends a performance measurement, calculates duration, and logs it.
 *
 * @param {string} measureName - The name of the performance measurement to end.
 */
const endMeasure = (measureName) => {
    try {
        performance.mark(`${measureName}-end`);
        performance.measure(measureName, `${measureName}-start`, `${measureName}-end`);
        performance.getEntriesByType('measure').forEach((entry) => {
            AppLogger_1.default.info(`Duration of ${entry.name}: ${entry.duration} ms`);
        });
    }
    catch (error) {
        // @ts-expect-error TS(2571): Object is of type 'unknown'.
        AppLogger_1.default.info(`Error ending performance measurement: ${error.message}`);
    }
};
/**
 * Utilities for performance measurement and logging.
 */
const PerformancesUtils = {
    startMeasure,
    endMeasure,
};
exports.default = PerformancesUtils;

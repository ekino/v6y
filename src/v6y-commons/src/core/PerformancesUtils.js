import AppLogger from './AppLogger.js';

/**
 * Starts a performance measurement by creating a 'start' mark.
 *
 * @param {string} measureName - The name of the performance measurement.
 */
const startMeasure = (measureName) => {
    try {
        performance.mark(`${measureName}-start`);
    } catch (error) {
        AppLogger.info(`Error starting performance measurement: ${error.message}`);
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
            AppLogger.info(`Duration of ${entry.name}: ${entry.duration} ms`);
        });
    } catch (error) {
        AppLogger.info(`Error ending performance measurement: ${error.message}`);
    }
};

/**
 * Utilities for performance measurement and logging.
 */
const PerformancesUtils = {
    startMeasure,
    endMeasure,
};

export default PerformancesUtils;

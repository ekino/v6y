import AppLogger from './AppLogger.js';

const startMeasure = (measureName) => {
    performance.mark(`${measureName}-start`);
};

const endMeasure = (measureName) => {
    performance.mark(`${measureName}-end`);
    performance.measure(measureName, `${measureName}-start`, `${measureName}-end`);
    performance.getEntriesByType('measure').forEach((entry) => {
        AppLogger.info(`Duration of ${entry.name}: ${entry.duration} ms`);
    });
};

const PerformancesUtils = {
    startMeasure,
    endMeasure,
};

export default PerformancesUtils;

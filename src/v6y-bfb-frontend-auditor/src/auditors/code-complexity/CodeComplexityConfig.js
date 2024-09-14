import { Matcher } from '@v6y/commons';
import { auditStatus } from '@v6y/commons/src/config/AuditHelpConfig.js';

/**
 * Format Maintainability Status according to value
 * @param {number} fileMaintainability
 */
const formatMaintainabilityStatus = (fileMaintainability) =>
    Matcher()
        .on(
            () => Math.round(fileMaintainability || 0) < 65,
            () => auditStatus.error,
        )
        .on(
            () => Math.round(fileMaintainability || 0) >= 85,
            () => auditStatus.success,
        )
        .on(
            () =>
                Math.round(fileMaintainability || 0) >= 65 &&
                Math.round(fileMaintainability || 0) < 85,
            () => auditStatus.warning,
        )
        .otherwise(() => '');

/**
 * Format Halstead Metrics Reports
 * @param {object} halsteadMetrics
 * @param {object} application
 * @param {string} analyzedFile
 * @param {string} analyzedBranch
 * @return {*[]}
 */
const formatHalsteadReports = ({ halsteadMetrics, application, analyzedFile, analyzedBranch }) => {
    const { bugs, difficulty, effort, length, time, volume } = halsteadMetrics || {};

    const halsteadReports = [];

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    if (length) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-length',
            subCategory: null,
            status: null,
            score: length,
            scorePercent: null,
            scoreUnit: '',
            module,
        });
    }

    if (volume) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-volume',
            status: null,
            score: volume,
            scorePercent: null,
            scoreUnit: 'bit',
            module,
        });
    }

    if (difficulty) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-difficulty',
            status: null,
            score: difficulty,
            scorePercent: null,
            scoreUnit: '',
            module,
        });
    }

    if (effort) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-effort',
            status: null,
            score: effort,
            scorePercent: null,
            scoreUnit: 'bit',
            module,
        });
    }

    if (bugs) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-estimated-bugs',
            status: null,
            score: bugs,
            scorePercent: null,
            scoreUnit: '',
            module,
        });
    }

    if (time) {
        halsteadReports.push({
            type: 'Code-Complexity',
            category: 'halstead-program-time-to-implement',
            status: null,
            score: time,
            scorePercent: null,
            scoreUnit: 's',
            module,
        });
    }

    return halsteadReports;
};

/**
 * Format Cyclomatic Complexity Report
 * @param {number} cyclomaticMetric
 * @param {object} application
 * @param {string} analyzedFile
 * @param {string} analyzedBranch
 * @return {object}
 * */
const formatCyclomaticComplexityReport = ({
    cyclomaticMetric,
    application,
    analyzedFile,
    analyzedBranch,
}) => {
    const complexityStatus = Matcher()
        .on(
            () => cyclomaticMetric <= 10,
            () => auditStatus.success,
        )
        .on(
            () => cyclomaticMetric > 10 && cyclomaticMetric <= 20,
            () => auditStatus.warning,
        )
        .on(
            () => cyclomaticMetric > 20 && cyclomaticMetric <= 40,
            () => auditStatus.error,
        )
        .on(
            () => cyclomaticMetric > 40,
            () => auditStatus.error,
        )
        .otherwise(() => '');

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    return {
        type: 'Code-Complexity',
        category: 'cyclomatic-complexity',
        status: complexityStatus,
        score: cyclomaticMetric,
        scorePercent: null,
        scoreUnit: '',
        module,
    };
};

/**
 * Format MaintainabilityIndex report
 * @param {number} fileMaintainability
 * @param {object} application
 * @param {string} analyzedFile
 * @param {string} analyzedBranch
 * @return {object}
 * */
const formatMaintainabilityIndexReport = ({
    fileMaintainability,
    application,
    analyzedFile,
    analyzedBranch,
}) => {
    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    return {
        type: 'Code-Complexity',
        category: 'maintainability-index',
        status: formatMaintainabilityStatus(fileMaintainability),
        score: null,
        scorePercent: fileMaintainability,
        scoreUnit: '%',
        module,
    };
};

/**
 * This function formats the Source Lines of Code (SLOC) indicators for a given file.
 *
 * @param {Object} fileSLOC - An object containing the physical and logical SLOC counts for the file.
 * @param {object} application - The application to audit
 * @param {string} analyzedFile
 * @param {string} analyzedBranch
 *
 * @returns {Array} codeSLOCIndicators - An array of objects, each representing a SLOC indicator for the file.
 * Each SLOC indicator object includes the type of SLOC ('code-sloc'), the category of SLOC (either 'physical sloc' or 'logical sloc'),
 * a title, a description, a status, the maximum and minimum scores (both set to 0), the actual score (either the physical or logical SLOC count),
 * a percentage score (null), a score unit (an empty string), and the file name.
 *
 * @example
 * const fileSLOC = {
 *   physical: 100,
 *   logical: 80
 * };
 * const file = 'example.js';
 * const indicators = formatFileSLOCIndicators(fileSLOC, file);
 * console.log(indicators);
 */
const formatFileSLOCIndicators = ({ fileSLOC, application, analyzedFile, analyzedBranch }) => {
    const codeSLOCIndicators = [];

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    if (fileSLOC) {
        codeSLOCIndicators.push({
            type: 'Code-Complexity',
            category: 'physical-sloc',
            status: null,
            score: fileSLOC.physical || 0,
            scorePercent: null,
            scoreUnit: '',
            module,
        });

        codeSLOCIndicators.push({
            type: 'Code-Complexity',
            category: 'logical-sloc',
            status: null,
            score: fileSLOC.logical || 0,
            scorePercent: null,
            scoreUnit: '',
            module,
        });
    }

    return codeSLOCIndicators;
};

/**
 * Format Cyclomatic Complexity Report
 * @param {object} summary
 * @param {object} application
 * @param {string} analyzedFile
 * @param {string} analyzedBranch
 * @return {object}
 * */
const formatCodeComplexitySummary = ({ summary, application, analyzedFile, analyzedBranch }) => {
    if (!summary) {
        return {};
    }

    const module = {
        appId: application?._id,
        url: application?.repo?.webUrl,
        branch: analyzedBranch,
        path: analyzedFile,
    };

    return {
        type: 'Code-Complexity',
        category: 'maintainability-index-project-average',
        status: formatMaintainabilityStatus(summary?.average?.maintainability),
        score: null,
        scorePercent: summary?.average?.maintainability,
        scoreUnit: '%',
        module,
    };
};

const CodeComplexityConfig = {
    formatHalsteadReports,
    formatMaintainabilityIndexReport,
    formatCyclomaticComplexityReport,
    formatFileSLOCIndicators,
    formatCodeComplexitySummary,
};

export default CodeComplexityConfig;

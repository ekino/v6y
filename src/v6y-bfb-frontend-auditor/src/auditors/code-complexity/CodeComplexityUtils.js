import { AppLogger, AuditUtils } from '@v6y/commons';
import lodash from 'lodash';
import TyphonEscomplex from 'typhonjs-escomplex';

import CodeComplexityConfig from './CodeComplexityConfig.js';

const { isAcceptedFileType, isExcludedFile } = AuditUtils;

const {
    formatHalsteadReports,
    formatMaintainabilityIndexReport,
    formatCyclomaticComplexityReport,
    formatFileSLOCIndicators,
    formatCodeComplexitySummary,
} = CodeComplexityConfig;

const { getFiles, parseFile } = AuditUtils;

/**
 * Parser options for the escomplex module analyzer.
 * @type {Object}
 */
const ComplexityParserOptions = {
    sourceType: 'module',
    plugins: [
        'jsx',
        'objectRestSpread',
        'classProperties',
        'optionalCatchBinding',
        'asyncGenerators',
        'decorators-legacy',
        'typescript',
        'dynamicImport',
    ],
};

/**
 * Processes the source code to generate a complexity report.
 * @param {string} source - The source code to analyze.
 * @param {Object} options - The options for the escomplex module analyzer.
 * @param {Object} reportInfo - Information about the report.
 * @returns {Object} - Returns a report of the analyzed module.
 */
function process(source, options, reportInfo) {
    AppLogger.info(`[CodeComplexityUtils - process] options:  ${options}`);
    AppLogger.info(`[CodeComplexityUtils - process] reportInfo:  ${reportInfo}`);

    // https://github.com/escomplex/escomplex
    // https://github.com/escomplex/escomplex/blob/master/METRICS.md
    // https://github.com/typhonjs-node-escomplex/typhonjs-escomplex/blob/master/src/ESComplex.js#L3
    // https://github.com/typhonjs-node-ast/babel-parser/blob/master/src/BabelParser.js
    // https://github.com/typhonjs-node-ast/babel-parser/blob/master/src/BabelParser.js#L1C38-L1C38
    // https://github.com/typhonjs-node-ast/babel-parser/blob/master/src/BabelParser.js#L81
    // https://babeljs.io/docs/babel-parser#babelparserparsecode-options
    // https://babeljs.io/docs/babel-parser#output
    // http://www.literateprogramming.com/mccabe.pdf
    // http://horst-zuse.homepage.t-online.de/z-halstead-final-05-1.pdf
    // https://avandeursen.com/2014/08/29/think-twice-before-using-the-maintainability-index/
    const report = TyphonEscomplex.analyzeModule(source, options, ComplexityParserOptions);
    AppLogger.info(`[CodeComplexityUtils - process] report:  ${report}`);

    // Make the short filename easily accessible
    report.module = reportInfo.fileShort;

    // Munge the new `escomplex-js` format to match the older format of
    // `complexity-report`
    report.aggregate = report.aggregate || {};
    report.aggregate.complexity = lodash.clone(report.methodAggregate);

    function methodToReportFunction(func) {
        func.complexity = lodash.extend(
            {},
            {
                cyclomatic: func.cyclomatic,
                sloc: func.sloc,
                halstead: func.halstead,
            },
        );

        func.line = func.line || func.lineStart;

        return func;
    }

    function allClassMethods(report) {
        if (!report.classes.length) {
            return [];
        }

        return lodash
            .chain(report.classes)
            .map((_class) => _class.methods)
            .flatten()
            .value();
    }

    const functions = report.methods.concat(allClassMethods(report));

    report.functions = lodash.chain(functions).map(methodToReportFunction).value();

    return report;
}

/**
 * An object containing the complexity analyzer.
 * @type {Object}
 */
const analyzers = {
    complexity: {
        process,
    },
};

/**
 * An object containing the options for the complexity report.
 * @type {Object}
 */
const complexityReportOptions = {
    complexity: {
        loc: true,
        newmi: true,
        range: true,
    },
};

/**
 * Filters out information unused in the overview for space/performance.
 * @param {Array} reports - The reports to filter.
 * @returns {Object} - Returns an object containing the summary and files.
 */
const getOverviewReport = (reports) => {
    AppLogger.info(`[CodeComplexityUtils - getOverviewReport] reports:  ${reports?.length}`);

    const moduleFiles = [];
    const summary = {
        total: {
            psloc: 0,
            lsloc: 0,
            maintainability: 0,
        },
        average: {
            psloc: 0,
            lsloc: 0,
            maintainability: 0,
        },
    };

    reports.forEach((report) => {
        // clone objects so we don't have to worry about side effects
        summary.total.psloc += report.complexity.aggregate.sloc.physical;
        summary.total.lsloc += report.complexity.aggregate.sloc.logical;
        summary.total.maintainability += report.complexity.maintainability;

        const aggregate = lodash.cloneDeep(report.complexity.aggregate);
        if (report.complexity) {
            moduleFiles.push({
                file: report.complexity.module,
                fileMaintainability: lodash.cloneDeep(report.complexity.maintainability),
                fileComplexity: aggregate,
                fileSLOC: {
                    physical: report.complexity.aggregate.sloc.physical,
                    logical: report.complexity.aggregate.sloc.logical,
                },
            });
        }
    });

    summary.average.psloc = Math.round(summary.total.psloc / reports.length);
    summary.average.lsloc = Math.round(summary.total.lsloc / reports.length);
    summary.average.maintainability = (summary.total.maintainability / reports.length).toFixed(2);

    AppLogger.info(
        `[CodeComplexityUtils - getOverviewReport] moduleFiles:  ${moduleFiles?.length}`,
    );

    return {
        summary,
        files: moduleFiles,
    };
};

/**
 * Inspects a file and runs reports against it.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.file - The path to the file.
 * @param {string} params.basePath - The common base path for all files.
 * @param {Object} params.options - The options for parsing and reporting.
 * @returns {Object|null} An object containing the reports for each analyzer, or null if an error occurs.
 */
const inspectFile = ({ file, basePath, options }) => {
    try {
        const report = parseFile(file, basePath, options);
        if (!report) {
            return null;
        }

        const { fileSafe, fileShort, source } = report;

        const reportInfo = {
            file,
            fileShort,
            fileSafe,
        };

        // run reports against current file
        return Object.keys(analyzers).reduce((acc, analyzerName) => {
            // if we should not execute parser
            if (!options[analyzerName]) {
                return acc;
            }
            try {
                const reporter = analyzers[analyzerName];
                acc[analyzerName] = reporter?.process(source, options[analyzerName], reportInfo);
                return acc;
            } catch (error) {
                AppLogger.info(
                    `[CodeComplexityUtils - parseFile]: file ${file} process error:  ${error}`,
                );
                return acc;
            }
        }, {});
    } catch (error) {
        AppLogger.info(`[CodeComplexityUtils - inspectFile] error:  ${error.message}`);
        return null;
    }
};

/**
 * Inspect directory files.
 * @param {string} srcDir - The directory to parse.
 * @param {Object} options - The options for the parser.
 * @returns {Array} - Returns an array containing the reports.
 */
const inspectFiles = (srcDir, options) => {
    try {
        const { files, basePath } = getFiles(srcDir);
        AppLogger.info(`[CodeComplexityUtils - inspectFiles] files:  ${files?.length}`);
        AppLogger.info(`[CodeComplexityUtils - inspectFiles] basePath:  ${basePath}`);

        if (!files?.length) {
            return [];
        }

        const mergedOptions = {
            ...(options || {}),
            ...complexityReportOptions,
        };

        const reports = [];

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];
            const report = inspectFile({
                file,
                basePath,
                options: mergedOptions,
            });
            if (report && Object.keys(report) && Object.keys(report).length > 0) {
                reports.push(report);
            }
        }

        AppLogger.info(`[CodeComplexityUtils - inspectFiles] reports:  ${reports?.length}`);

        return reports;
    } catch (error) {
        AppLogger.info(`[CodeComplexityUtils - inspectFiles] error:  ${error.message}`);
        return null;
    }
};

/**
 * Inspects the source directory.
 * @param {Object} params - The parameters for the inspection.
 * @returns {Object} - Returns an object containing the overview report.
 */
const inspectDirectory = ({ srcDir, options }) => {
    try {
        AppLogger.info(`[CodeComplexityUtils - inspectDirectory] srcDir:  ${srcDir}`);

        const reports = inspectFiles(srcDir, options);

        AppLogger.info(`[CodeComplexityUtils - inspectDirectory] reports:  ${reports?.length}`);

        return getOverviewReport(reports);
    } catch (error) {
        return null;
    }
};

/**
 * Build files complexity reports
 * @param {String} workspaceFolder
 * @param {Object} application
 * @return {null|Array}
 */
const formatCodeComplexityReports = ({ workspaceFolder, application }) => {
    try {
        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] workspaceFolder:  ${workspaceFolder}`,
        );
        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] application:  ${Object.keys(application || {})?.length}`,
        );

        if (!workspaceFolder?.length || !application) {
            return [];
        }

        const { summary, files } = inspectDirectory({
            srcDir: workspaceFolder,
            options: {
                exclude: null,
                noempty: true,
                quiet: true,
                title: workspaceFolder,
            },
        });

        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] files:  ${files?.length}`,
        );
        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] summary:  ${Object.keys(summary || {})?.length}`,
        );

        if (!files?.length) {
            return [];
        }

        const auditableFiles = files
            .filter((item) => {
                const fileName = item.file;
                return isAcceptedFileType(fileName) && !isExcludedFile(fileName);
            })
            .sort((a, b) => (a.fileMaintainability > b.fileMaintainability ? 1 : -1));

        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] auditableFiles:  ${auditableFiles?.length}`,
        );

        if (!auditableFiles?.length) {
            return [];
        }

        // /Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/loader
        const analyzedBranch = workspaceFolder.split('/').pop();

        const auditReports = [];

        auditReports.push(
            formatCodeComplexitySummary({
                summary,
                application,
                analyzedFile: null,
                analyzedBranch,
            }),
        );

        for (const auditableFile of auditableFiles) {
            const { file, fileMaintainability, fileComplexity, fileSLOC } = auditableFile || {};

            AppLogger.info(`[CodeComplexityUtils - formatCodeComplexityReports] file:  ${file}`);

            if (!file?.length) {
                continue;
            }

            const { cyclomatic, halstead } = fileComplexity || {};

            auditReports.push(
                formatMaintainabilityIndexReport({
                    fileMaintainability,
                    application,
                    analyzedFile: file,
                    analyzedBranch,
                }),
            );

            auditReports.push(
                ...formatFileSLOCIndicators({
                    fileSLOC,
                    application,
                    analyzedFile: file,
                    analyzedBranch,
                }),
            );

            auditReports.push(
                formatCyclomaticComplexityReport({
                    cyclomaticMetric: cyclomatic,
                    application,
                    analyzedFile: file,
                    analyzedBranch,
                }),
            );

            auditReports.push(
                ...formatHalsteadReports({
                    halsteadMetrics: halstead,
                    application,
                    analyzedFile: file,
                    analyzedBranch,
                }),
            );
        }

        return auditReports;
    } catch (error) {
        AppLogger.info(
            `[CodeComplexityUtils - buildModuleComplexityReport] error:  ${error.message}`,
        );
        return [];
    }
};

const CodeComplexityUtils = {
    formatCodeComplexityReports,
};

export default CodeComplexityUtils;

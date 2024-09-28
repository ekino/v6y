import { AppLogger, AuditType, AuditUtils, ComplexityAnalysisOptionsType } from '@v6y/commons';
import lodash from 'lodash';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import TyphonEscomplex from 'typhonjs-escomplex';

import { AuditCommonsType } from '../types/AuditCommonsType.js';
import {
    AggregateType,
    ClassMethodType,
    CodeComplexityReportType,
    ComplexityParserOptionsType,
    InspectFileResultType,
    MethodFunctionType,
    ModuleFileType,
    OverviewReportType,
    ReportInfoType,
    ReportType,
} from '../types/CodeComplexityAuditType.ts';
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
const ComplexityParserOptions: object = {
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
 * An object containing the options for the complexity parser.
 * @type {Object}
 */
const analyzers: {
    [key: string]: {
        process: (
            source: string,
            options: ComplexityParserOptionsType,
            reportInfo: ReportInfoType,
        ) => CodeComplexityReportType;
    };
} = {
    complexity: {
        process,
    },
};

/**
 * The options for the escomplex module analyzer.
 * @type {Object}
 */
const complexityReportOptions: object = {
    complexity: {
        loc: true,
        newmi: true,
        range: true,
    },
};

/**
 * The default aggregate object.
 */
const defaultAggregate: AggregateType = {
    cyclomatic: 0,
    halstead: {
        operands: { total: 0, distinct: 0, identifiers: [] },
        operators: { total: 0, distinct: 0, identifiers: [] },
        length: 0,
        vocabulary: 0,
        difficulty: 0,
        volume: 0,
        effort: 0,
        bugs: 0,
        time: 0,
    },
    sloc: { physical: 0, logical: 0 },
    maintainability: 0,
    complexity: {
        cyclomatic: 0,
        halstead: {},
    },
};

const defaultSummary = {
    total: { psloc: 0, lsloc: 0, maintainability: 0 },
    average: { psloc: 0, lsloc: 0, maintainability: 0 },
};

/**
 * Processes the source code and returns a report.
 * @param source
 * @param options
 * @param reportInfo
 */
function process(
    source: string,
    options: ComplexityParserOptionsType,
    reportInfo: ReportInfoType,
): CodeComplexityReportType {
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

    function methodToReportFunction(func: MethodFunctionType): MethodFunctionType {
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

    function allClassMethods(report: ReportType): ClassMethodType[] {
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
 * Filters out information unused in the overview for space/performance.
 * @param {Array} reports - The reports to filter.
 * @returns {Object} - Returns an object containing the summary and files.
 */
const getOverviewReport = (reports: InspectFileResultType[]): OverviewReportType => {
    AppLogger.info(`[CodeComplexityUtils - getOverviewReport] reports:  ${reports?.length}`);

    const moduleFiles: ModuleFileType[] = [];
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
        summary.total.psloc += report.complexity?.aggregate.sloc.physical || 0;
        summary.total.lsloc += report.complexity?.aggregate.sloc.logical || 0;
        summary.total.maintainability += report.complexity?.maintainability || 0;

        const aggregate = lodash.cloneDeep(report.complexity?.aggregate);
        if (report.complexity) {
            moduleFiles.push({
                file: report.complexity.module,
                fileMaintainability: lodash.cloneDeep(report.complexity.maintainability),
                fileComplexity: aggregate || defaultAggregate,
                fileSLOC: {
                    physical: report.complexity.aggregate.sloc.physical,
                    logical: report.complexity.aggregate.sloc.logical,
                },
            });
        }
    });

    summary.average.psloc = Math.round(summary.total.psloc / reports.length);
    summary.average.lsloc = Math.round(summary.total.lsloc / reports.length);
    summary.average.maintainability = parseFloat(
        (summary.total.maintainability / reports.length).toFixed(2),
    );

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
 * @param {ComplexityAnalysisOptionsType} params - The parameters for the function.
 * @returns {Object|null} An object containing the reports for each analyzer, or null if an error occurs.
 */
const inspectFile = ({
    file,
    basePath,
    options,
}: ComplexityAnalysisOptionsType): InspectFileResultType | null => {
    try {
        const report = parseFile({
            file,
            basePath,
            options,
        });
        if (!report) {
            return null;
        }

        const { fileSafe, fileShort, source } = report;

        const reportInfo: ReportInfoType = {
            file: file || '',
            fileShort,
            fileSafe,
        };

        // run reports against current file
        return Object.keys(analyzers).reduce(
            (acc: { [key: string]: CodeComplexityReportType }, analyzerName) => {
                // if we should not execute parser
                if (!options || !(analyzerName in options)) {
                    return acc;
                }

                try {
                    const reporter = analyzers[analyzerName];
                    acc[analyzerName] = reporter?.process(
                        source,
                        options[analyzerName] as ComplexityParserOptionsType,
                        reportInfo,
                    );
                    return acc;
                } catch (error) {
                    AppLogger.info(
                        `[CodeComplexityUtils - parseFile]: file ${file} process error:  ${error}`,
                    );
                    return acc;
                }
            },
            {},
        );
    } catch (error) {
        AppLogger.info(`[CodeComplexityUtils - inspectFile] error:  ${error}`);
        return null;
    }
};

/**
 * Inspects the files in the source directory.
 * @param srcDir
 * @param options
 */
const inspectFiles = ({ srcDir, options }: ComplexityAnalysisOptionsType) => {
    try {
        const { files, basePath } = getFiles(srcDir || '') || {};
        AppLogger.info(`[CodeComplexityUtils - inspectFiles] files:  ${files?.length}`);
        AppLogger.info(`[CodeComplexityUtils - inspectFiles] basePath:  ${basePath}`);

        if (!files?.length) {
            return [];
        }

        const mergedOptions = {
            ...(options || {}),
            ...complexityReportOptions,
        };

        const reports: InspectFileResultType[] = [];

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
        AppLogger.info(`[CodeComplexityUtils - inspectFiles] error:  ${error}`);
        return null;
    }
};

/**
 * Inspects the files in the source directory.
 * @param srcDir
 * @param options
 */
const inspectDirectory = ({
    srcDir,
    options,
}: ComplexityAnalysisOptionsType): OverviewReportType | null => {
    try {
        AppLogger.info(`[CodeComplexityUtils - inspectDirectory] srcDir:  ${srcDir}`);

        const reports = inspectFiles({ srcDir, options });

        AppLogger.info(`[CodeComplexityUtils - inspectDirectory] reports:  ${reports?.length}`);

        return getOverviewReport(reports || []);
    } catch (error) {
        AppLogger.info(`[CodeComplexityUtils - inspectDirectory] error:  ${error}`);
        return null;
    }
};

/**
 * Formats the code complexity reports.
 * @param workspaceFolder
 * @param application
 */
const formatCodeComplexityReports = ({
    workspaceFolder,
    application,
}: AuditCommonsType): AuditType[] | null => {
    try {
        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] workspaceFolder:  ${workspaceFolder}`,
        );

        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] application:  ${Object.keys(application || {})?.length}`,
        );

        if (!workspaceFolder?.length || !application) {
            return null;
        }

        const { summary, files } =
            inspectDirectory({
                srcDir: workspaceFolder,
                options: {
                    exclude: undefined,
                    noempty: true,
                    quiet: true,
                    title: workspaceFolder,
                },
            }) || {};

        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] files:  ${files?.length}`,
        );

        AppLogger.info(
            `[CodeComplexityUtils - formatCodeComplexityReports] summary:  ${Object.keys(summary || {})?.length}`,
        );

        if (!files?.length) {
            return null;
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
            return null;
        }

        // /Users/hela.ben-khalfallah/Desktop/github_workspace/v6y/src/code-analysis-workspace/mfs/loader
        const analyzedBranch = workspaceFolder.split('/').pop();

        const auditReports: AuditType[] = [];

        auditReports.push(
            formatCodeComplexitySummary({
                summary: summary || defaultSummary,
                cyclomaticMetric: 0,
                fileMaintainability: 0,
                fileSLOC: { physical: 0, logical: 0 },
                halsteadMetrics: {},
                application,
                analyzedFile: '',
                analyzedBranch: analyzedBranch || '',
            }),
        );

        for (const auditableFile of auditableFiles) {
            const { file, fileMaintainability, fileComplexity, fileSLOC } = auditableFile || {};

            AppLogger.info(`[CodeComplexityUtils - formatCodeComplexityReports] file:  ${file}`);

            if (!file?.length || !fileComplexity) {
                continue;
            }

            const { cyclomatic, halstead } = fileComplexity;

            auditReports.push(
                formatMaintainabilityIndexReport({
                    fileMaintainability,
                    application,
                    analyzedFile: file,
                    analyzedBranch: analyzedBranch || '',
                    cyclomaticMetric: 0,
                    fileSLOC: { physical: 0, logical: 0 },
                    halsteadMetrics: {},
                    summary: defaultSummary,
                }),
            );

            auditReports.push(
                ...formatFileSLOCIndicators({
                    cyclomaticMetric: 0,
                    fileMaintainability: 0,
                    halsteadMetrics: {},
                    summary: defaultSummary,
                    fileSLOC,
                    application,
                    analyzedFile: file,
                    analyzedBranch: analyzedBranch || '',
                }),
            );

            auditReports.push(
                formatCyclomaticComplexityReport({
                    fileMaintainability: 0,
                    fileSLOC: { physical: 0, logical: 0 },
                    halsteadMetrics: {},
                    summary: defaultSummary,
                    cyclomaticMetric: cyclomatic,
                    application,
                    analyzedFile: file,
                    analyzedBranch: analyzedBranch || '',
                }),
            );

            auditReports.push(
                ...formatHalsteadReports({
                    cyclomaticMetric: 0,
                    fileMaintainability: 0,
                    fileSLOC: { physical: 0, logical: 0 },
                    summary: defaultSummary,
                    halsteadMetrics: halstead,
                    application,
                    analyzedFile: file,
                    analyzedBranch: analyzedBranch || '',
                }),
            );
        }

        return auditReports;
    } catch (error) {
        AppLogger.info(`[CodeComplexityUtils - buildModuleComplexityReport] error:  ${error}`);
        return null;
    }
};

const CodeComplexityUtils = {
    formatCodeComplexityReports,
};

export default CodeComplexityUtils;

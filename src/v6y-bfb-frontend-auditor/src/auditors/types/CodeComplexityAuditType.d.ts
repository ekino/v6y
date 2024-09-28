import { ApplicationType } from '@v6y/commons';
export interface FileSlocMetricType {
    physical: number;
    logical: number;
}
export interface HalsteadMetricType {
    operators?: {
        distinct: number;
        total: number;
        identifiers: string[];
    };
    operands?: {
        distinct: number;
        total: number;
        identifiers: string[];
    };
    length?: number;
    vocabulary?: number;
    difficulty?: number;
    volume?: number;
    effort?: number;
    bugs?: number;
    time?: number;
}
export interface MaintainabilityMetricType {
    maintainability: number;
}
export interface CodeComplexityReportSummaryType {
    average: MaintainabilityMetricType;
}
export interface ApplicationCodeComplexityReportType {
    halsteadMetrics: HalsteadMetricType;
    summary: CodeComplexityReportSummaryType;
    cyclomaticMetric: number;
    fileMaintainability: number;
    fileSLOC: FileSlocMetricType;
    application: ApplicationType;
    analyzedFile: string;
    analyzedBranch: string;
}
export interface ComplexityParserOptionsType {
    sourceType: string;
    plugins: string[];
}
export interface ReportInfoType {
    file: string;
    fileShort: string;
    fileSafe: string;
}
export interface MethodFunctionType {
    complexity: {
        cyclomatic: number;
        sloc: FileSlocMetricType;
        halstead: HalsteadMetricType;
    };
    line?: number;
    lineStart?: number;
    cyclomatic: number;
    sloc: FileSlocMetricType;
    halstead: HalsteadMetricType;
}
export interface ClassMethodType {
    name: string;
    complexity: {
        cyclomatic: number;
        sloc: FileSlocMetricType;
        halstead: HalsteadMetricType;
    };
    lineStart: number;
    line: number;
}
export interface ClassType {
    name: string;
    methods: ClassMethodType[];
}
export interface ReportType {
    classes: ClassType[];
}
export interface AggregateType {
    sloc: FileSlocMetricType;
    cyclomatic: number;
    maintainability: number;
    halstead: HalsteadMetricType;
    complexity: {
        cyclomatic: number;
        halstead: HalsteadMetricType;
    };
}
export interface ModuleFileType {
    file: string;
    fileMaintainability: number;
    fileComplexity: AggregateType;
    fileSLOC: FileSlocMetricType;
}
export interface OverviewReportType {
    summary: {
        total: {
            psloc: number;
            lsloc: number;
            maintainability: number;
        };
        average: {
            psloc: number;
            lsloc: number;
            maintainability: number;
        };
    };
    files: ModuleFileType[];
}
export interface CodeComplexityReportType {
    cyclomatic: number;
    sloc: FileSlocMetricType;
    halstead: HalsteadMetricType;
    lineStart: number;
    line: number;
}
export interface InspectFileResultType {
    complexity?: {
        cyclomatic: number;
        maintainability: number;
        sloc: FileSlocMetricType;
        halstead: HalsteadMetricType;
        aggregate: AggregateType;
        module: string;
    };
}

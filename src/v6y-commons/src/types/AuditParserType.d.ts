export interface CommonOptionsType {
    [key: string]: unknown;
    exclude?: RegExp;
    noempty?: boolean;
}
export interface ParsedFileType {
    file: string;
    fileSafe: string;
    fileShort: string;
    source: string;
    options: CommonOptionsType;
}
export interface ParsedFileResultType {
    files: string[];
    basePath: string;
}
export interface ComplexityAnalysisOptionsType {
    file?: string;
    srcDir?: string;
    basePath?: string;
    options?: CommonOptionsType;
}

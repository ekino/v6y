import { ComplexityAnalysisOptionsType, ParsedFileResultType, ParsedFileType } from '../types/AuditParserType.js';
declare const AuditUtils: {
    isAcceptedFileType: (fileName: string) => boolean;
    isExcludedFile: (filePath: string) => boolean;
    getFiles: (srcDir: string) => ParsedFileResultType | null;
    generateHash: (value: string) => string | null;
    parseFile: ({ file, basePath, options, }: ComplexityAnalysisOptionsType) => ParsedFileType | null;
    getFileContent: (filePath: string) => Promise<string | null>;
    isNonCompliantFile: (antiPattern: string, source: string) => Promise<boolean>;
    deleteAuditFile: ({ filePath, fileFullPath, }: {
        filePath?: string;
        fileFullPath?: string;
    }) => boolean;
    getAuditEligibleFiles: ({ workspaceFolder }: {
        workspaceFolder: string;
    }) => {
        auditEligibleFiles?: undefined;
    } | {
        auditEligibleFiles: string[];
    };
    getFilesRecursively: (directory: string, filesPaths: string[]) => string[];
};
export default AuditUtils;

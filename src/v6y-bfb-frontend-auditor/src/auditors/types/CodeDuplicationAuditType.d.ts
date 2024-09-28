import { ApplicationType } from '@v6y/commons';
interface DuplicationTotalSummaryType {
    duplicatedLines: number;
    percentage: number;
}
interface DuplicationFileType {
    firstFile: {
        name: string;
        start: number;
        end: number;
    };
    secondFile: {
        name: string;
        start: number;
        end: number;
    };
    fragment: string;
    lines: number;
}
export interface CodeDuplicationAuditType {
    applicationId?: number;
    application?: ApplicationType;
    workspaceFolder?: string;
    duplicationTotalSummary?: DuplicationTotalSummaryType;
    duplicationFiles?: DuplicationFileType[];
}
export {};

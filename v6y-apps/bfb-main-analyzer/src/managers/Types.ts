import { ApplicationType } from '@v6y/core-logic';

export interface BuildApplicationBranchParams {
    name: string;
}

export interface BuildApplicationParams {
    applicationId?: number;
    workspaceFolder?: string;
    application?: ApplicationType;
    branch?: BuildApplicationBranchParams;
    branches?: BuildApplicationBranchParams[];
}

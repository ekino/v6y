import { ApplicationType } from '@v6y/commons';
import { MadgeModuleDependencyGraph } from 'madge';
export interface ProjectTree {
    [node: string]: string[];
}
export interface NormalizedProjectTree {
    nodes: string[];
    edges: [string, string][];
}
export interface CodeModularityAuditType {
    application?: ApplicationType;
    applicationId?: number;
    workspaceFolder?: string;
    modularitySummary?: {
        projectLouvainDetails?: {
            communities?: {
                [key: string]: number;
            };
            modularity?: number;
        };
        projectDegreeCentrality?: {
            [key: string]: number;
        };
        projectInDegreeCentrality?: {
            [key: string]: number;
        };
        projectOutDegreeCentrality?: {
            [key: string]: number;
        };
        projectTree?: MadgeModuleDependencyGraph;
        projectGraph?: {
            [key: string]: number;
        };
        projectDensity: number;
    };
}

import { ApplicationType } from '@v6y/core-logic';
import Graph from 'graphology';
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
            communities?: { [key: string]: number };
            modularity?: number;
        };
        projectDegreeCentrality?: { [key: string]: number };
        projectInDegreeCentrality?: { [key: string]: number };
        projectOutDegreeCentrality?: { [key: string]: number };
        projectTree?: MadgeModuleDependencyGraph;
        projectGraph?: typeof Graph;
        projectDensity: number;
    };
}

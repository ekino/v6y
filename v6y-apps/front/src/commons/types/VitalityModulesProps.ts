export interface VitalityModuleType {
    name: string;
    label: string;
    type: string;
    category: string;
    score: number;
    scoreUnit: string;
    scoreStatus: string;
    auditStatus: string;
    branch: string;
    path: string;
    auditHelp: Record<string, string>;
    statusHelp: Record<string, string>;
    evolutionHelp: Record<string, string>;
}

interface VitalityModulesProps {
    modules: VitalityModuleType[];
    source?: string;
    status?: string;
}

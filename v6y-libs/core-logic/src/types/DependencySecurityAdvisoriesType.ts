export interface ModuleVulnerabilityType {
    package: {
        ecosystem: string;
        name: string;
    };
    vulnerable_version_range: string;
    first_patched_version: string;
}

export interface WeaknessesType {
    cwe_id: string;
    name: string;
}

export interface SeverityScoreType {
    vector_string: string;
    score: number;
}

export interface DependencySecurityAdvisoriesType {
    ghsaId: string;
    cveId: string;
    summary: string;
    description: string;
    htmlUrl: string;
    type: string;
    severity: string;
    severityScore: SeverityScoreType;
    sourceCodeLocation: string;
    references: string[];
    vulnerabilities: ModuleVulnerabilityType[];
    weakness: WeaknessesType[];
}

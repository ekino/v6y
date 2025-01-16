import {
    ModuleVulnerabilityType,
    SeverityScoreType,
    WeaknessesType,
} from './DependencySecurityAdvisoriesType.js';

export interface RegistryType {
    webUrl?: string;
    gitUrl?: string;
    organization?: string;
    allBranches?: string[];
    id?: string;
    archived?: string;
    empty_repo?: string;
    _links?: {
        repo_branches?: string;
    };
}

export interface RegistryQueriesOptions {
    organization?: string;
    type?: string;
}

export interface RepositoryConfigType {
    baseURL: string;
    api?: string;
    urls?: {
        repositoryDetailsUrl?: (repoName: string) => string;
        fileContentUrl?: (repoName: string, fileName: string) => string;
        securityAdvisoriesUrl?: (pageSize: string, affectedModule: string) => string;
    };
    headers?: {
        Accept?: string;
        Authorization?: string;
        'PRIVATE-TOKEN'?: string;
        'Content-Type'?: string;
        'User-Agent'?: string;
    };
}

export interface GetRepositoryFileContentOptions {
    organization?: string;
    gitRepositoryName?: string;
    fileName?: string;
    type?: string;
}

export interface GetRepositoryBranchesOptions {
    repoBranchesUrl?: string;
    type?: string;
}

export interface GetPackageInfosOptions {
    packageName?: string;
    type?: string;
}

export interface RepositoryBranchType {
    name: string;
}

export interface RepositorySecurityAdvisoriesType {
    ghsa_id: string;
    cve_id: string;
    html_url: string;
    summary: string;
    description: string;
    type: string;
    severity: string;
    source_code_location: string;
    references: string[];
    vulnerabilities: ModuleVulnerabilityType[];
    cwes: WeaknessesType[];
    cvss: SeverityScoreType;
}

export interface GetRepositorySecurityAdvisoriesOptions {
    pageSize: string;
    affectedModule: string;
    type?: string;
}

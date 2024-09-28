export interface GithubConfigType {
    baseURL: string;
    api: string;
    urls: {
        fileContentUrl: (repoName: string, fileName: string) => string;
        repositoryDetailsUrl: (repoName: string) => string;
    };
    headers: {
        Authorization: string;
        Accept: string;
        'Content-Type': string;
        'User-Agent': string;
    };
}
export interface GitlabConfigType {
    baseURL: string;
    api: string;
    urls: {
        repositoryDetailsUrl: (repoName: string) => string;
        fileContentUrl: (repoName: string, fileName: string) => string;
    };
    headers: {
        'PRIVATE-TOKEN': string;
        'Content-Type': string;
    };
}
export interface BuildQueryOptions {
    organization?: string;
    type?: string;
}
export interface GetFileContentOptions {
    organization?: string;
    gitRepositoryName?: string;
    fileName?: string;
    type?: string;
}
export interface GetRepositoryBranchesOptions {
    repoBranchesUrl?: string;
    type?: string;
}
export interface RepositoryBranchType {
    name: string;
}
export interface RepositoryType {
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __importDefault(require("../core/AppLogger"));
const GithubConfig = (organization) => ({
    baseURL: 'https://api.github.com',
    api: '',
    urls: {
        fileContentUrl: (repoName, fileName) => `https://api.github.com/repos/${organization}/${repoName}/contents/${fileName}`,
        repositoryDetailsUrl: (repoName) => `https://api.github.com/repos/${organization}/${repoName}`,
    },
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'V6Y',
    },
});
const GitlabConfig = (organization) => ({
    baseURL: `https://gitlab.${organization}.com`,
    api: 'api/v4',
    urls: {
        repositoryDetailsUrl: (repoName) => `https://gitlab.${organization}.com/api/v4/projects?search=${repoName}`,
        fileContentUrl: (repoName, fileName) => `https://gitlab.${organization}.com/api/v4/projects?search=${repoName}/${fileName}`,
    },
    headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_PRIVATE_TOKEN || '',
        'Content-Type': 'application/json',
    },
});
const buildQueryOptions = ({ organization, type = 'gitlab', }) => type === 'gitlab' ? GitlabConfig(organization) : GithubConfig(organization);
const getRepositoryDetails = async ({ organization, gitRepositoryName, type, }) => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        const repositoryResponse = await fetch(queryOptions.urls.repositoryDetailsUrl(gitRepositoryName), {
            method: 'GET',
            headers: queryOptions.headers,
        });
        const repositoryJsonResponse = await repositoryResponse.json();
        if (!repositoryJsonResponse || !Array.isArray(repositoryJsonResponse)) {
            return null;
        }
        return repositoryJsonResponse[0];
    }
    catch (error) {
        AppLogger_1.default.info(`[RepositoryApi - getRepositoryDetails] error:  ${error instanceof Error ? error.message : error}`);
        return null;
    }
};
const getFileContent = async ({ organization, gitRepositoryName, fileName, type, }) => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        const baseUrl = queryOptions.urls.fileContentUrl(gitRepositoryName, fileName);
        AppLogger_1.default.info(`[RepositoryApi - getFileContent] baseUrl:  ${baseUrl}`);
        const fileContentResponse = await fetch(baseUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });
        const fileJsonResponse = await fileContentResponse.json();
        AppLogger_1.default.info(`[RepositoryApi - getFileContent] fileJsonResponse:  ${Object.keys(fileJsonResponse || {}).length}`);
        if (!fileJsonResponse || !Object.keys(fileJsonResponse || {}).length) {
            return null;
        }
        return fileJsonResponse;
    }
    catch (error) {
        AppLogger_1.default.info(`[RepositoryApi - getFileContent] error:  ${error instanceof Error ? error.message : error}`);
    }
};
const getRepositoryBranches = async ({ repoBranchesUrl, type, }) => {
    try {
        const queryOptions = buildQueryOptions({ organization: undefined, type });
        const repositoryResponse = await fetch(repoBranchesUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });
        return await repositoryResponse.json();
    }
    catch (error) {
        AppLogger_1.default.info(`[RepositoryApi - getRepositoryDetails] error:  ${error instanceof Error ? error.message : error}`);
    }
};
const prepareGitBranchZipConfig = ({ zipBaseDir, application, branchName, }) => {
    try {
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] branchName:  ${branchName}`);
        if (!application || !branchName?.length) {
            return null;
        }
        const normalizedBranchName = branchName.split('/').pop()?.replaceAll(' ', '-');
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] normalizedBranchName:  ${normalizedBranchName}`);
        const zipFileName = `${normalizedBranchName || branchName}.zip`;
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] zipFileName:  ${zipFileName}`);
        const { repo } = application;
        const zipSourceUrl = `${repo?.webUrl}/-/archive/refs/heads/${branchName}/${zipFileName}`;
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] zipSourceUrl:  ${zipSourceUrl}`);
        const zipDestinationDir = `${zipBaseDir}/${application?.acronym}`;
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] zipDestinationDir:  ${zipDestinationDir}`);
        const zipBaseFileName = `${zipBaseDir}/${application?.acronym}/${normalizedBranchName}`;
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] zipDestinationDir:  ${zipBaseFileName}`);
        return {
            zipSourceUrl,
            zipFileName,
            zipBaseFileName,
            zipDestinationDir,
            zipOptions: {
                headers: buildQueryOptions({})?.headers,
            },
        };
    }
    catch (error) {
        AppLogger_1.default.info(`[RepositoryApi - prepareGitZipConfig] error:  ${error instanceof Error ? error.message : error}`);
        return null;
    }
};
const RepositoryApi = {
    getRepositoryDetails,
    getRepositoryBranches,
    getFileContent,
    prepareGitBranchZipConfig,
};
exports.default = RepositoryApi;

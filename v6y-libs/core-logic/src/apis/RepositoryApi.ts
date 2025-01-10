import AppLogger from '../core/AppLogger.ts';
import {
    BuildQueryOptions,
    GetFileContentOptions,
    GetRepositoryBranchesOptions,
    GithubConfigType,
    GitlabConfigType,
    RepositoryBranchType,
    RepositoryType,
} from '../types/RepositoryType.ts';
import { ApplicationZipConfigOptions, DownloadZipOptions } from '../types/ZipType.ts';

/**
 * Builds the configuration for the Github API.
 * @param organization
 * @constructor
 */
const GithubConfig = (organization: string): GithubConfigType => ({
    baseURL: 'https://api.github.com',
    api: '',

    urls: {
        fileContentUrl: (repoName: string, fileName: string) =>
            `https://api.github.com/repos/${organization}/${repoName}/contents/${fileName}`,
        repositoryDetailsUrl: (repoName: string) =>
            `https://api.github.com/repos/${organization}/${repoName}`,
    },

    headers: {
        Authorization: `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'V6Y',
    },
});

/**
 * Builds the configuration for the Gitlab API.
 * @param organization
 * @constructor
 */
const GitlabConfig = (organization: string): GitlabConfigType => ({
    baseURL: `https://gitlab.${organization}.com`,
    api: 'api/v4',

    urls: {
        repositoryDetailsUrl: (repoName: string) =>
            `https://gitlab.${organization}.com/api/v4/projects?search=${repoName}`,
        fileContentUrl: (repoName: string, fileName: string) =>
            `https://gitlab.${organization}.com/api/v4/projects?search=${repoName}/${fileName}`,
    },

    headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_PRIVATE_TOKEN || '',
        'Content-Type': 'application/json',
    },
});

/**
 * Builds the query options for the API.
 * @param organization
 * @param type
 */
const buildQueryOptions = ({
    organization,
    type = 'gitlab',
}: BuildQueryOptions): GithubConfigType | GitlabConfigType =>
    type === 'gitlab' ? GitlabConfig(organization!) : GithubConfig(organization!);

/**
 * Gets the details of a repository.
 * @param organization
 * @param gitRepositoryName
 * @param type
 */
const getRepositoryDetails = async ({
    organization,
    gitRepositoryName,
    type,
}: GetFileContentOptions): Promise<RepositoryType | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });

        const repositoryResponse = await fetch(
            queryOptions.urls.repositoryDetailsUrl(gitRepositoryName || ''),
            {
                method: 'GET',
                headers: queryOptions.headers,
            },
        );

        const repositoryJsonResponse = await repositoryResponse.json();

        if (!repositoryJsonResponse || !Array.isArray(repositoryJsonResponse)) {
            return null;
        }

        return repositoryJsonResponse[0];
    } catch (error) {
        AppLogger.info(
            `[RepositoryApi - getRepositoryDetails] error:  ${
                error instanceof Error ? error.message : error
            }`,
        );
        return null;
    }
};

/**
 * Gets the content of a file.
 * @param organization
 * @param gitRepositoryName
 * @param fileName
 * @param type
 */
const getFileContent = async ({
    organization,
    gitRepositoryName,
    fileName,
    type,
}: GetFileContentOptions): Promise<unknown | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        const baseUrl = queryOptions.urls.fileContentUrl(gitRepositoryName || '', fileName || '');
        AppLogger.info(`[RepositoryApi - getFileContent] baseUrl:  ${baseUrl}`);

        const fileContentResponse = await fetch(baseUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        const fileJsonResponse = await fileContentResponse.json();
        AppLogger.info(
            `[RepositoryApi - getFileContent] fileJsonResponse:  ${
                Object.keys(fileJsonResponse || {}).length
            }`,
        );

        if (!fileJsonResponse || !Object.keys(fileJsonResponse || {}).length) {
            return null;
        }

        return fileJsonResponse;
    } catch (error) {
        AppLogger.info(
            `[RepositoryApi - getFileContent] error:  ${
                error instanceof Error ? error.message : error
            }`,
        );
    }
};

/**
 * Gets the branches of a repository.
 * @param repoBranchesUrl
 * @param type
 */
const getRepositoryBranches = async ({
    repoBranchesUrl,
    type,
}: GetRepositoryBranchesOptions): Promise<RepositoryBranchType[] | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization: undefined, type });

        const repositoryResponse = await fetch(repoBranchesUrl || '', {
            method: 'GET',
            headers: queryOptions.headers,
        });

        return await repositoryResponse.json();
    } catch (error) {
        AppLogger.info(
            `[RepositoryApi - getRepositoryDetails] error:  ${
                error instanceof Error ? error.message : error
            }`,
        );
        return null;
    }
};

/**
 * Prepares the configuration for the Git branch zip.
 * @param zipBaseDir
 * @param application
 * @param branchName
 */
const prepareGitBranchZipConfig = ({
    zipBaseDir,
    application,
    branchName,
}: ApplicationZipConfigOptions): DownloadZipOptions | null => {
    try {
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] branchName:  ${branchName}`);

        if (!application || !branchName?.length) {
            return null;
        }

        const normalizedBranchName = branchName.split('/').pop()?.replaceAll(' ', '-');
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] normalizedBranchName:  ${normalizedBranchName}`,
        );

        const zipFileName = `${normalizedBranchName || branchName}.zip`;
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] zipFileName:  ${zipFileName}`);

        const { repo } = application;

        const zipSourceUrl = `${repo?.webUrl}/-/archive/refs/heads/${branchName}/${zipFileName}`;
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] zipSourceUrl:  ${zipSourceUrl}`);

        const zipDestinationDir = `${zipBaseDir}/${application?.acronym}`;
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] zipDestinationDir:  ${zipDestinationDir}`,
        );

        const zipBaseFileName = `${zipBaseDir}/${application?.acronym}/${normalizedBranchName}`;
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] zipDestinationDir:  ${zipBaseFileName}`,
        );

        return {
            zipSourceUrl,
            zipFileName,
            zipBaseFileName,
            zipDestinationDir,
            zipOptions: {
                headers: buildQueryOptions({})?.headers,
            },
        };
    } catch (error) {
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] error:  ${
                error instanceof Error ? error.message : error
            }`,
        );
        return null;
    }
};

const RepositoryApi = {
    getRepositoryDetails,
    getRepositoryBranches,
    getFileContent,
    prepareGitBranchZipConfig,
};

export default RepositoryApi;

import AppLogger from '../core/AppLogger.ts';
import {
    BuildQueryOptions,
    DeployementType,
    GetFileContentOptions,
    GetRepositoryBranchesOptions,
    GithubConfigType,
    GitlabConfigType,
    MergeRequestType,
    RepositoryBranchType,
    RepositoryType,
    getRepositoryDeploymentsOptions,
    getRepositoryMergeRequestsOptions,
} from '../types/RepositoryType.ts';
import { ApplicationZipConfigOptions, DownloadZipOptions } from '../types/ZipType.ts';
import DateUtils from '../utils/DateUtils.ts';
import { appendQueryParams } from '../utils/UrlUtils.ts';

/**
 * Builds the configuration for the Github API.
 * @param organization
 * @constructor
 */
const GithubConfig = (organization: string | null): GithubConfigType => {
    const baseURL = 'https://api.github.com';
    const reposBaseUrl = organization ? `${baseURL}/repos/${organization}` : `${baseURL}/repos`;
    const githubToken = process.env.GITHUB_PRIVATE_TOKEN;

    if (!githubToken?.length) {
        AppLogger.warn('[RepositoryApi - GithubConfig] Missing GitHub token environment variable');
    }

    return {
        baseURL,
        api: '',
        urls: {
            fileContentUrl: (repoName: string, fileName: string) =>
                `${reposBaseUrl}/${repoName}/contents/${fileName}`,
            repositoryDetailsUrl: (repoName: string) => `${reposBaseUrl}/${repoName}`,
        },
        headers: {
            ...(githubToken?.length ? { Authorization: `Bearer ${githubToken}` } : {}),
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'V6Y',
        },
    };
};

const GitlabConfig = (organization: string | null, baseUrl?: string): GitlabConfigType => {
    const baseURL =
        baseUrl || (organization ? `https://gitlab.${organization}.com` : 'https://gitlab.com');
    const gitlabToken =
        process.env.GITLAB_PRIVATE_TOKEN ||
        process.env.GITLAB_TOKEN ||
        process.env.GITLAB_ACCESS_TOKEN ||
        '';

    if (!gitlabToken.length) {
        AppLogger.warn('[RepositoryApi - GitlabConfig] Missing GitLab token environment variable');
    }

    return {
        baseURL,
        api: 'api/v4',

        urls: {
            repositoryDetailsUrl: (repoName: string) =>
                `${baseURL}/api/v4/projects?search=${repoName}`,
            fileContentUrl: (repoName: string, fileName: string) =>
                `${baseURL}/api/v4/projects?search=${repoName}/${fileName}`,
            repositoryDeploymentsUrl: (repoId: string) =>
                `${baseURL}/api/v4/projects/${repoId}/deployments`,
            repositoryMergeRequestsUrl: (repoId: string) =>
                `${baseURL}/api/v4/projects/${repoId}/merge_requests`,
        },

        headers: {
            'PRIVATE-TOKEN': gitlabToken,
            ...(gitlabToken.length ? { Authorization: `Bearer ${gitlabToken}` } : {}),
            'Content-Type': 'application/json',
        },
    };
};

/**
 * Builds the query options for the API.
 * @param organization
 * @param type
 * @param baseUrl
 */
const buildQueryOptions = ({
    organization,
    type = 'gitlab',
    baseUrl,
}: BuildQueryOptions): GithubConfigType | GitlabConfigType =>
    type === 'gitlab' ? GitlabConfig(organization!, baseUrl) : GithubConfig(organization!);

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
    baseUrl,
}: GetFileContentOptions): Promise<RepositoryType | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type, baseUrl });

        const repositoryResponse = await fetch(
            queryOptions.urls.repositoryDetailsUrl(gitRepositoryName || ''),
            {
                method: 'GET',
                headers: queryOptions.headers,
            },
        );

        const repositoryJsonResponse = await repositoryResponse.json();

        // GitLab's search endpoint returns an array of matches; GitHub's repo details
        // endpoint returns a single object. Support both response shapes.
        if (Array.isArray(repositoryJsonResponse)) {
            return repositoryJsonResponse[0] || null;
        }

        if (
            repositoryJsonResponse &&
            typeof repositoryJsonResponse === 'object' &&
            'id' in repositoryJsonResponse
        ) {
            return repositoryJsonResponse;
        }

        if (!repositoryResponse.ok) {
            AppLogger.warn(
                `[RepositoryApi - getRepositoryDetails] request failed with status ${repositoryResponse.status}: ${JSON.stringify(repositoryJsonResponse)}`,
            );
        }

        return null;
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
    baseUrl,
}: GetFileContentOptions): Promise<unknown | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type, baseUrl });
        const fileContentUrl = queryOptions.urls.fileContentUrl(
            gitRepositoryName || '',
            fileName || '',
        );
        AppLogger.info(`[RepositoryApi - getFileContent] baseUrl:  ${fileContentUrl}`);

        const fileContentResponse = await fetch(fileContentUrl, {
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
 * Gets the merge requests of a repository.
 * @param organization
 * @param repositoryId
 * @param dateStart
 * @param dateEnd
 * @param type
 */
const getRepositoryMergeRequests = async ({
    organization,
    repositoryId,
    dateStart,
    dateEnd,
    type = 'gitlab',
    baseUrl,
}: getRepositoryMergeRequestsOptions): Promise<MergeRequestType[]> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type, baseUrl });
        let mergeRequestsUrl = (queryOptions as GitlabConfigType).urls.repositoryMergeRequestsUrl(
            repositoryId,
        );

        if (dateStart && dateEnd) {
            mergeRequestsUrl = appendQueryParams(mergeRequestsUrl, {
                created_after: DateUtils.formatDateToString(dateStart, 'YYYY-MM-DD'),
                created_before: DateUtils.formatDateToString(dateEnd, 'YYYY-MM-DD'),
            });
        }

        AppLogger.info(
            `[RepositoryApi - getRepositoryMergeRequests] mergeRequestsUrl:  ${mergeRequestsUrl}`,
        );

        const mergeRequestsResponse = await fetch(mergeRequestsUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        return await mergeRequestsResponse.json();
    } catch (error) {
        AppLogger.info(
            `[RepositoryApi - getRepositoryMergeRequests] error: ${
                error instanceof Error ? error.message : error
            }`,
        );
        return [];
    }
};

/**
 * Gets the deployments of a repository.
 * @param organization
 * @param repositoryId
 * @param dateStart
 * @param dateEnd
 * @param type
 */
const getRepositoryDeployments = async ({
    organization,
    repositoryId,
    dateStart,
    dateEnd,
    type = 'gitlab',
    baseUrl,
}: getRepositoryDeploymentsOptions): Promise<DeployementType[]> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type, baseUrl });
        let deploymentsUrl = appendQueryParams(
            (queryOptions as GitlabConfigType).urls.repositoryDeploymentsUrl(repositoryId),
            { status: 'success' },
        );

        if (dateStart && dateEnd) {
            deploymentsUrl = appendQueryParams(deploymentsUrl, {
                finished_after: DateUtils.formatDateToString(dateStart, 'YYYY-MM-DD'),
                finished_before: DateUtils.formatDateToString(dateEnd, 'YYYY-MM-DD'),
                order_by: 'finished_at',
                sort: 'desc',
            });
        }

        AppLogger.info(
            `[RepositoryApi - getRepositoryDeployments] deploymentsUrl:  ${deploymentsUrl}`,
        );

        const deploymentsResponse = await fetch(deploymentsUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        return await deploymentsResponse.json();
    } catch (error) {
        AppLogger.info(
            `[RepositoryApi - getRepositoryDeployments] error: ${
                error instanceof Error ? error.message : error
            }`,
        );
        return [];
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

        const normalizedBranchName = branchName.replaceAll('/', '-').replaceAll(' ', '-');
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] normalizedBranchName:  ${normalizedBranchName}`,
        );

        const { repo } = application;

        const repositoryWebUrl = repo?.webUrl?.replace(/\/+$/, '');

        if (!repositoryWebUrl?.length) {
            return null;
        }

        const projectName = repositoryWebUrl.split('/').pop();
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] projectName:  ${projectName}`);

        const zipFileName = `${projectName}-${normalizedBranchName}.zip`;
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] zipFileName:  ${zipFileName}`);

        const isGithubRepository = repositoryWebUrl.includes('github.com');
        const repositoryOrigin = new URL(repositoryWebUrl).origin;
        const repositoryPath = new URL(repositoryWebUrl).pathname.replace(/^\//, '');

        // GitHub's archive URL is a path (…/archive/refs/heads/<branch>.zip), so each
        // path segment must be percent-encoded individually while keeping the '/'
        // separators literal (encodeURIComponent alone would also escape '/').
        const encodedBranchNamePath = branchName.split('/').map(encodeURIComponent).join('/');

        // GitLab web archive URLs can return HTML (login/forbidden) instead of binary zip.
        // Prefer the API archive endpoint, which supports PRIVATE-TOKEN auth headers.
        const gitlabProjectRef = encodeURIComponent(String(repo?.id || repositoryPath));

        const zipSourceUrl = isGithubRepository
            ? `${repositoryWebUrl}/archive/refs/heads/${encodedBranchNamePath}.zip`
            : appendQueryParams(
                  `${repositoryOrigin}/api/v4/projects/${gitlabProjectRef}/repository/archive.zip`,
                  { sha: branchName },
              );

        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] zipSourceUrl:  ${zipSourceUrl}`);

        const zipDestinationDir = `${zipBaseDir}/${application?.acronym}`;
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] zipDestinationDir:  ${zipDestinationDir}`,
        );

        const zipBaseFileName = `${zipBaseDir}/${application?.acronym}/${projectName}-${normalizedBranchName}`;
        AppLogger.info(
            `[RepositoryApi - prepareGitZipConfig] zipDestinationDir:  ${zipBaseFileName}`,
        );

        return {
            zipSourceUrl,
            zipFileName,
            zipBaseFileName,
            zipDestinationDir,
            zipOptions: {
                headers: buildQueryOptions({ type: isGithubRepository ? 'github' : 'gitlab' })
                    ?.headers,
            },
        };
    } catch (error) {
        AppLogger.error(
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
    getRepositoryMergeRequests,
    getRepositoryDeployments,
};

export default RepositoryApi;

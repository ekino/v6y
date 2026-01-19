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

/**
 * Builds the configuration for the Github API.
 * @param organization
 * @constructor
 */
const GithubConfig = (organization: string | null): GithubConfigType => {
    const baseURL = 'https://api.github.com';
    const reposBaseUrl = organization ? `${baseURL}/repos/${organization}` : `${baseURL}/repos`;

    return {
        baseURL,
        api: '',
        urls: {
            fileContentUrl: (repoName: string, fileName: string) =>
                `${reposBaseUrl}/${repoName}/contents/${fileName}`,
            repositoryDetailsUrl: (repoName: string) => `${reposBaseUrl}/${repoName}`,
        },
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'V6Y',
        },
    };
};

/**
 * Builds the configuration for the Gitlab API.
 * @param organization
 * @constructor
 */
const GitlabConfig = (organization: string | null): GitlabConfigType => {
    const baseURL = organization ? `https://gitlab.${organization}.com` : 'https://gitlab.com';
    const token = process.env.GITLAB_PRIVATE_TOKEN || '';

    AppLogger.info(
        `[RepositoryApi - GitlabConfig] baseURL: ${baseURL}, tokenExists: ${!!token}, tokenLength: ${token.length}`,
    );

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
            'PRIVATE-TOKEN': token,
            'Content-Type': 'application/json',
        },
    };
};

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
        AppLogger.info(
            `[RepositoryApi - getRepositoryDetails] organization: ${organization}, gitRepositoryName: ${gitRepositoryName}, type: ${type}`,
        );

        const queryOptions = buildQueryOptions({ organization, type });

        AppLogger.info(
            `[RepositoryApi - getRepositoryDetails] queryOptions.urls.repositoryDetailsUrl: ${queryOptions.urls.repositoryDetailsUrl(gitRepositoryName || '')}`,
        );

        const repositoryResponse = await fetch(
            queryOptions.urls.repositoryDetailsUrl(gitRepositoryName || ''),
            {
                method: 'GET',
                headers: queryOptions.headers,
            },
        );

        const repositoryJsonResponse = await repositoryResponse.json();

        AppLogger.info(
            `[RepositoryApi - getRepositoryDetails] Response status: ${repositoryResponse.status}, isArray: ${Array.isArray(repositoryJsonResponse)}, length: ${repositoryJsonResponse?.length}`,
        );

        if (!repositoryJsonResponse || !Array.isArray(repositoryJsonResponse)) {
            return null;
        }

        if (repositoryJsonResponse.length > 0) {
            AppLogger.info(
                `[RepositoryApi - getRepositoryDetails] Found repository with id: ${repositoryJsonResponse[0]?.id}`,
            );
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
 * Gets the merge requests of a repository.
 * @param organization
 * @param repositoryId
 * @param dateStart
 * @param dateEnd
 * @param type
 */
const getRepositoryMergeRequests = async ({
    organization,
    projectPath,
    repositoryId,
    dateStart,
    dateEnd,
    type = 'gitlab',
}: getRepositoryMergeRequestsOptions): Promise<MergeRequestType[]> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        const projectIdentifier = projectPath ? encodeURIComponent(projectPath) : repositoryId;
        let mergeRequestsUrl = (queryOptions as GitlabConfigType).urls.repositoryMergeRequestsUrl(
            projectIdentifier!,
        );

        if (dateStart && dateEnd) {
            mergeRequestsUrl += `?created_after=${DateUtils.formatDateToString(
                dateStart,
                'YYYY-MM-DD',
            )}&created_before=${DateUtils.formatDateToString(dateEnd, 'YYYY-MM-DD')}`;
        }

        AppLogger.info(
            `[RepositoryApi - getRepositoryMergeRequests] mergeRequestsUrl:  ${mergeRequestsUrl}`,
        );

        const mergeRequestsResponse = await fetch(mergeRequestsUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        AppLogger.info(
            `[RepositoryApi - getRepositoryMergeRequests] Response status: ${mergeRequestsResponse.status}`,
        );

        if (!mergeRequestsResponse.ok) {
            AppLogger.error(
                `[RepositoryApi - getRepositoryMergeRequests] API error: ${mergeRequestsResponse.status} - ${mergeRequestsResponse.statusText}`,
            );
            return [];
        }

        const mergeRequestsData = await mergeRequestsResponse.json();
        AppLogger.info(
            `[RepositoryApi - getRepositoryMergeRequests] Raw response length: ${Array.isArray(mergeRequestsData) ? mergeRequestsData.length : 'not an array'}`,
        );

        return mergeRequestsData;
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
    projectPath,
    repositoryId,
    dateStart,
    dateEnd,
    type = 'gitlab',
}: getRepositoryDeploymentsOptions): Promise<DeployementType[]> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        const projectIdentifier = projectPath ? encodeURIComponent(projectPath) : repositoryId;
        let deploymentsUrl =
            (queryOptions as GitlabConfigType).urls.repositoryDeploymentsUrl(projectIdentifier!) +
            '?status=success';

        if (dateStart && dateEnd) {
            deploymentsUrl += `&finished_after=${DateUtils.formatDateToString(
                dateStart,
                'YYYY-MM-DD',
            )}&finished_before=${DateUtils.formatDateToString(dateEnd, 'YYYY-MM-DD')}&order_by=finished_at&sort=desc`;
        }

        AppLogger.info(
            `[RepositoryApi - getRepositoryDeployments] deploymentsUrl:  ${deploymentsUrl}`,
        );

        const deploymentsResponse = await fetch(deploymentsUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        AppLogger.info(
            `[RepositoryApi - getRepositoryDeployments] Response status: ${deploymentsResponse.status}`,
        );

        if (!deploymentsResponse.ok) {
            AppLogger.error(
                `[RepositoryApi - getRepositoryDeployments] API error: ${deploymentsResponse.status} - ${deploymentsResponse.statusText}`,
            );
            return [];
        }

        const deploymentsData = await deploymentsResponse.json();
        AppLogger.info(
            `[RepositoryApi - getRepositoryDeployments] Raw response length: ${Array.isArray(deploymentsData) ? deploymentsData.length : 'not an array'}`,
        );

        return deploymentsData;
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
    getRepositoryMergeRequests,
    getRepositoryDeployments,
};

export default RepositoryApi;

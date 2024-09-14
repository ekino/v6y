import AppLogger from '../core/AppLogger.js';

/**
 * Builds the query options for GitLab API requests.
 *
 * @param {Object} options - The options object.
 * @param {string} options.organization - The GitLab organization name.
 * @returns {Object} The query options object containing baseURL, headers, and api version.
 */
const buildQueryOptions = ({ organization }) => ({
    baseURL: `https://gitlab.${organization}.com`,
    headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_PRIVATE_TOKEN,
        'Content-Type': 'application/json',
    },
    api: 'api/v4',
});

/**
 * Fetches details of a Git repository.
 *
 * @param {Object} options - The options object.
 * @param {string} options.organization - The GitLab organization name.
 * @param {string} options.gitRepositoryName - The name of the Git repository.
 * @returns {Object|null} The repository details object or null if not found or error occurs.
 */
const getRepositoryDetails = async ({ organization, gitRepositoryName }) => {
    try {
        const queryOptions = buildQueryOptions({ organization });

        const repositoryResponse = await fetch(
            `${queryOptions.baseURL}/${queryOptions.api}/projects?search=${gitRepositoryName}`,
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
        AppLogger.info(`[RepositoryApi - getRepositoryDetails] error:  ${error.message}`);
    }
};

/**
 * Fetches branches of a Git repository.
 *
 * @param {Object} options - The options object.
 * @param {string} options.repoBranchesUrl - The URL to fetch repository branches.
 * @returns {Promise<any>} An array of branch objects or null if error occurs.
 */
const getRepositoryBranches = async ({ repoBranchesUrl }) => {
    try {
        const queryOptions = buildQueryOptions({ organization: null });

        const repositoryResponse = await fetch(repoBranchesUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        return await repositoryResponse.json();
    } catch (error) {
        AppLogger.info(`[RepositoryApi - getRepositoryDetails] error:  ${error.message}`);
    }
};

/**
 * Prepares the configuration for creating a zip file from a Git branch.
 *
 * @param {Object} options - The options object.
 * @param {string} options.zipBaseDir - The base directory for storing the zip file.
 * @param {Object} options.application - The application object containing repository details.
 * @param {string} options.branchName - The name of the Git branch.
 * @returns {Object|null} The zip configuration object or null if invalid input or error occurs.
 */
const prepareGitBranchZipConfig = ({ zipBaseDir, application, branchName }) => {
    try {
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] branchName:  ${branchName}`);

        if (!application || !branchName?.length) {
            return null;
        }

        const normalizedBranchName = branchName?.split('/')?.pop()?.replaceAll(' ', '-');
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
        AppLogger.info(`[RepositoryApi - prepareGitZipConfig] error:  ${error.message}`);
        return null;
    }
};

/**
 * The RepositoryApi object containing functions for interacting with Git repositories.
 */
const RepositoryApi = {
    getRepositoryDetails,
    getRepositoryBranches,
    prepareGitBranchZipConfig,
};

export default RepositoryApi;

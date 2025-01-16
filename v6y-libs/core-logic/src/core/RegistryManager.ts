import AppLogger from '../core/AppLogger.ts';
import { DependencySecurityAdvisoriesType } from '../types/DependencySecurityAdvisoriesType.js';
import {
    GetPackageInfosOptions,
    GetRepositoryBranchesOptions,
    GetRepositoryFileContentOptions,
    GetRepositorySecurityAdvisoriesOptions,
    RegistryQueriesOptions,
    RegistryType,
    RepositoryBranchType,
    RepositoryConfigType,
    RepositorySecurityAdvisoriesType,
} from '../types/RegistryType.ts';
import { ApplicationZipConfigOptions, DownloadZipOptions } from '../types/ZipType.ts';
import Matcher from './Matcher.ts';

/**
 * Builds the configuration for the Github API.
 * @param organization
 * @constructor
 */
const GithubConfig = (organization: string): RepositoryConfigType => ({
    baseURL: 'https://api.github.com',
    api: '',

    urls: {
        fileContentUrl: (repoName: string, fileName: string) =>
            `https://api.github.com/repos/${organization}/${repoName}/contents/${fileName}`,
        repositoryDetailsUrl: (repoName: string) =>
            `https://api.github.com/repos/${organization}/${repoName}`,
        securityAdvisoriesUrl: (pageSize: string, affectedModule: string) =>
            `https://api.github.com/advisories?per_page=${pageSize}&ecosystem=npm&affects=${affectedModule}`,
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
const GitlabConfig = (organization: string): RepositoryConfigType => ({
    baseURL: `https://gitlab.${organization}.com`,
    api: 'api/v4',

    urls: {
        repositoryDetailsUrl: (repoName: string) =>
            `https://gitlab.${organization}.com/api/v4/projects?search=${repoName}`,
        fileContentUrl: (repoName: string, fileName: string) =>
            `https://gitlab.${organization}.com/api/v4/projects?search=${repoName}/${fileName}`,
        securityAdvisoriesUrl: () => '',
    },

    headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_PRIVATE_TOKEN || '',
        'Content-Type': 'application/json',
    },
});

/**
 * Builds the configuration for the NPM API.
 * @constructor
 */
const NpmConfig = (): RepositoryConfigType => ({
    baseURL: 'https://skimdb.npmjs.com/registry/',

    urls: {},

    headers: { 'Content-Type': 'application/json' },
});

/**
 * Builds the query options for the API.
 * @param organization
 * @param type
 */
const buildQueryOptions = ({
    organization,
    type = 'gitlab',
}: RegistryQueriesOptions): RepositoryConfigType =>
    Matcher()
        .on(
            () => type === 'github',
            () => GithubConfig(organization!),
        )
        .on(
            () => type === 'npm',
            () => NpmConfig(),
        )
        .otherwise(() => GitlabConfig(organization!)) as RepositoryConfigType;

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
}: GetRepositoryFileContentOptions): Promise<RegistryType | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        if (!queryOptions) {
            return null;
        }

        const repositoryUrl = queryOptions.urls?.repositoryDetailsUrl?.(gitRepositoryName || '');
        if (!repositoryUrl) {
            return null;
        }

        const repositoryResponse = await fetch(repositoryUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        const repositoryJsonResponse = await repositoryResponse.json();

        if (!repositoryJsonResponse || !Array.isArray(repositoryJsonResponse)) {
            return null;
        }

        return repositoryJsonResponse[0];
    } catch (error) {
        AppLogger.info(
            `[RegistryManager - getRepositoryDetails] error:  ${
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
}: GetRepositoryFileContentOptions): Promise<unknown | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization, type });
        if (!queryOptions) {
            return null;
        }

        const baseUrl = queryOptions.urls?.fileContentUrl?.(
            gitRepositoryName || '',
            fileName || '',
        );
        AppLogger.info(`[RegistryManager - getFileContent] baseUrl:  ${baseUrl}`);
        if (!baseUrl) {
            return null;
        }

        const fileContentResponse = await fetch(baseUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        const fileJsonResponse = await fileContentResponse.json();
        AppLogger.info(
            `[RegistryManager - getFileContent] fileJsonResponse:  ${
                Object.keys(fileJsonResponse || {}).length
            }`,
        );

        if (!fileJsonResponse || !Object.keys(fileJsonResponse || {}).length) {
            return null;
        }

        return fileJsonResponse;
    } catch (error) {
        AppLogger.info(
            `[RegistryManager - getFileContent] error:  ${
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
            `[RegistryManager - getRepositoryDetails] error:  ${
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
        AppLogger.info(`[RegistryManager - prepareGitZipConfig] branchName:  ${branchName}`);

        if (!application || !branchName?.length) {
            return null;
        }

        const normalizedBranchName = branchName.split('/').pop()?.replaceAll(' ', '-');
        AppLogger.info(
            `[RegistryManager - prepareGitZipConfig] normalizedBranchName:  ${normalizedBranchName}`,
        );

        const zipFileName = `${normalizedBranchName || branchName}.zip`;
        AppLogger.info(`[RegistryManager - prepareGitZipConfig] zipFileName:  ${zipFileName}`);

        const { repo } = application;

        const zipSourceUrl = `${repo?.webUrl}/-/archive/refs/heads/${branchName}/${zipFileName}`;
        AppLogger.info(`[RegistryManager - prepareGitZipConfig] zipSourceUrl:  ${zipSourceUrl}`);

        const zipDestinationDir = `${zipBaseDir}/${application?.acronym}`;
        AppLogger.info(
            `[RegistryManager - prepareGitZipConfig] zipDestinationDir:  ${zipDestinationDir}`,
        );

        const zipBaseFileName = `${zipBaseDir}/${application?.acronym}/${normalizedBranchName}`;
        AppLogger.info(
            `[RegistryManager - prepareGitZipConfig] zipDestinationDir:  ${zipBaseFileName}`,
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
            `[RegistryManager - prepareGitZipConfig] error:  ${
                error instanceof Error ? error.message : error
            }`,
        );
        return null;
    }
};

/**
 * Gets the security advisories of a repository.
 * @param pageSize
 * @param affectedModule
 * @param type
 */
const getRepositorySecurityAdvisories = async ({
    pageSize,
    affectedModule,
    type,
}: GetRepositorySecurityAdvisoriesOptions): Promise<DependencySecurityAdvisoriesType[] | null> => {
    try {
        const queryOptions = buildQueryOptions({ organization: undefined, type });
        if (!queryOptions) {
            return null;
        }

        const baseUrl = queryOptions.urls?.securityAdvisoriesUrl?.(pageSize, affectedModule);
        AppLogger.info(`[RegistryManager - getRepositorySecurityAdvisories] baseUrl:  ${baseUrl}`);
        if (!baseUrl) {
            return null;
        }

        const repositorySecurityAdvisoriesResponse = await fetch(baseUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        const repositorySecurityAdvisoriesJsonResponse =
            await repositorySecurityAdvisoriesResponse.json();
        AppLogger.info(
            `[RegistryManager - getRepositorySecurityAdvisories] repositorySecurityAdvisories length:  ${
                repositorySecurityAdvisoriesJsonResponse?.length
            }`,
        );

        if (
            !repositorySecurityAdvisoriesJsonResponse ||
            !repositorySecurityAdvisoriesJsonResponse?.length
        ) {
            return null;
        }

        return repositorySecurityAdvisoriesJsonResponse?.map(
            (advisory: RepositorySecurityAdvisoriesType) => ({
                ghsaId: advisory.ghsa_id,
                cveId: advisory.cve_id,
                htmlUrl: advisory.html_url,
                summary: advisory.summary,
                description: advisory.description,
                type: advisory.type,
                severity: advisory.severity,
                sourceCodeLocation: advisory.source_code_location,
                references: advisory.references,
                vulnerabilities: advisory.vulnerabilities,
                weakness: advisory.cwes, // weaknesses
                severityScore: advisory.cvss, // score
            }),
        );
    } catch (error) {
        AppLogger.info(
            `[RegistryManager - getRepositorySecurityAdvisories] error:  ${
                error instanceof Error ? error.message : error
            }`,
        );
        return null;
    }
};

/**
 * Gets the package infos.
 * @param moduleName
 * @param type
 */
const getPackageInfos = async ({ packageName, type }: GetPackageInfosOptions) => {
    try {
        // https://skimdb.npmjs.com/registry/react-cookie
        // https://docs.npmjs.com/cli/v8/using-npm/registry
        if (!packageName?.length) {
            return null;
        }

        const queryOptions = buildQueryOptions({ organization: undefined, type });
        if (!queryOptions) {
            return null;
        }

        AppLogger.info(
            `[RegistryManager - getRepositorySecurityAdvisories] baseUrl:  ${queryOptions.baseURL}`,
        );
        if (!queryOptions.baseURL) {
            return null;
        }

        const registryInfosResponse = await fetch(`${queryOptions.baseURL}/${packageName}`, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        AppLogger.info(
            `[RegistryManager - getPackageInfos] registryInfosResponse:  ${registryInfosResponse}`,
        );

        const registryInfosJsonResponse = await registryInfosResponse.json();
        AppLogger.info(
            `[RegistryManager - getPackageInfos] registryInfosJsonResponse:  ${registryInfosJsonResponse}`,
        );

        return registryInfosJsonResponse;
    } catch (error) {
        AppLogger.info(`[RegistryManager - getPackageInfos] error:  ${error}`);
        return {};
    }
};

const RegistryManager = {
    getRepositoryDetails,
    getRepositoryBranches,
    getFileContent,
    prepareGitBranchZipConfig,
    getRepositorySecurityAdvisories,
    getPackageInfos,
};

export default RegistryManager;

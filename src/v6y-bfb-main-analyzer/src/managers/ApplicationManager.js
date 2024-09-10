import { AppLogger, ApplicationProvider, ZipUtils } from '@v6y/commons';

const ZIP_BASE_DIR = '../code-analysis-workspace';

const buildQueryOptions = ({ organization }) => ({
    baseURL: `https://gitlab.${organization}.com`,
    headers: {
        'PRIVATE-TOKEN': 'JyeFxrbBR8_zZrKQGegZ',
        'Content-Type': 'application/json',
    },
    api: 'api/v4',
});

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
        AppLogger.info(`[ApplicationManager - getRepositoryDetails] error:  ${error.message}`);
    }
};

const getRepositoryBranches = async ({ repoBranchesUrl }) => {
    try {
        const queryOptions = buildQueryOptions({ organization: null });

        const repositoryResponse = await fetch(repoBranchesUrl, {
            method: 'GET',
            headers: queryOptions.headers,
        });

        return await repositoryResponse.json();
    } catch (error) {
        AppLogger.info(`[ApplicationManager - getRepositoryDetails] error:  ${error.message}`);
    }
};

const prepareGitBranchZipConfig = ({ application, branchName }) => {
    try {
        AppLogger.info(`[ApplicationManager - prepareGitZipConfig] branchName:  ${branchName}`);

        if (!application || !branchName?.length) {
            return null;
        }

        const normalizedBranchName = branchName?.split('/')?.pop()?.replaceAll(' ', '-');
        AppLogger.info(
            `[ApplicationManager - prepareGitZipConfig] normalizedBranchName:  ${normalizedBranchName}`,
        );

        const zipFileName = `${normalizedBranchName || branchName}.zip`;
        AppLogger.info(`[ApplicationManager - prepareGitZipConfig] zipFileName:  ${zipFileName}`);

        const { repo } = application;

        const zipSourceUrl = `${repo?.webUrl}/-/archive/refs/heads/${branchName}/${zipFileName}`;
        AppLogger.info(`[ApplicationManager - prepareGitZipConfig] zipSourceUrl:  ${zipSourceUrl}`);

        const zipDestinationDir = `${ZIP_BASE_DIR}/${application?.acronym}`;
        AppLogger.info(
            `[ApplicationManager - prepareGitZipConfig] zipDestinationDir:  ${zipDestinationDir}`,
        );

        const zipBaseFileName = `${ZIP_BASE_DIR}/${application?.acronym}/${normalizedBranchName}`;
        AppLogger.info(
            `[ApplicationManager - prepareGitZipConfig] zipDestinationDir:  ${zipBaseFileName}`,
        );

        return {
            zipSourceUrl,
            zipFileName,
            zipBaseFileName,
            zipDestinationDir,
        };
    } catch (error) {
        AppLogger.info(`[ApplicationManager - prepareGitZipConfig] error:  ${error.message}`);
        return null;
    }
};

// comparison avec bisto pour les versions
// lancement snyk ?

const buildApplicationDependenciesAnalysis = async ({ application, branch, workspace }) => {};

const buildApplicationDetailsByBranch = async ({ application, branch }) => {
    try {
        // prepare zip config
        const { zipSourceUrl, zipDestinationDir, zipFileName, zipBaseFileName } =
            prepareGitBranchZipConfig({
                application,
                branchName: branch?.name,
            });

        if (!zipSourceUrl?.length || !zipDestinationDir?.length || !zipFileName?.length) {
            return null;
        }

        // zip download
        const zipDownloadStatus = await ZipUtils.downloadZip({
            zipSourceUrl,
            zipDestinationDir,
            zipFileName,
            zipOptions: {
                headers: buildQueryOptions({})?.headers,
            },
        });

        if (!zipDownloadStatus) {
            return null;
        }

        // unzip file
        const workspaceFolder = await ZipUtils.unZipFile({
            zipOriginalSourceDir: zipDestinationDir,
            zipOriginalFileName: zipFileName,
            zipNewSourceDir: zipBaseFileName,
        });

        if (!workspaceFolder) {
            return null;
        }

        await buildApplicationDependenciesAnalysis({
            application,
            branch,
            workspace: workspaceFolder,
        });

        return {};
    } catch (error) {
        AppLogger.info(
            `[ApplicationManager - buildApplicationDetailsByBranch] error:  ${error.message}`,
        );
    }
};

const buildApplicationDetails = async (application) => {
    try {
        // 1. for each application:
        // 1.1. download zip for repo and branch
        // 1.2. analyse each repo-branch-zip
        // 1.3. delete zip
        if (
            !application?.name?.length ||
            !application?.acronym?.length ||
            !application?.contactMail?.length ||
            !application?.description?.length ||
            !application?.repo?.organization?.length ||
            !application?.repo?.gitUrl?.length
        ) {
            return false;
        }

        // 1. get list of branches
        const { organization, gitUrl } = application?.repo;
        const gitRepositoryName = gitUrl?.split('/')?.pop()?.replace('.git', '');

        const repositoryDetails = await getRepositoryDetails({
            organization,
            gitRepositoryName,
        });

        if (
            !repositoryDetails?.id ||
            repositoryDetails?.archived ||
            repositoryDetails?.empty_repo
        ) {
            return false;
        }

        const { _links: repositoryLinks } = repositoryDetails;

        const repositoryBranches = await getRepositoryBranches({
            repoBranchesUrl: repositoryLinks?.repo_branches,
        });

        if (!repositoryBranches?.length) {
            return false;
        }

        for (const branch of repositoryBranches) {
            const applicationDetailsByBranch = buildApplicationDetailsByBranch({
                application,
                branch,
            });

            if (applicationDetailsByBranch) {
                // update application branches and status
            }
        }

        return true;
    } catch (error) {
        AppLogger.info('[ApplicationManager - buildApplicationDetails] error: ', error);
        return false;
    }
};

const buildApplicationList = async (options) => {
    try {
        // 0. read available applications
        const applications = await ApplicationProvider.getApplicationListByPageAndParams({});
        AppLogger.info(
            '[ApplicationManager -  buildApplicationList] applications: ',
            applications?.length,
        );

        if (!applications?.length) {
            return false;
        }

        // 1. for each application:
        // 1.1. download zip for repo and branch
        // 1.2. analyse each repo-branch-zip
        // 1.3. delete zip
        for (const application of applications) {
            await buildApplicationDetails(application);
        }

        return true;
    } catch (error) {
        AppLogger.info('[ApplicationManager - buildApplicationList] error: ', error);
        return false;
    }
};

const ApplicationManager = {
    buildApplicationList,
};

export default ApplicationManager;

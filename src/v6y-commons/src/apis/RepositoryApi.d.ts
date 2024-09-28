import { GetFileContentOptions, GetRepositoryBranchesOptions, RepositoryBranchType, RepositoryType } from '../types/RepositoryType.ts';
import { ApplicationZipConfigOptions, DownloadZipOptions } from '../types/ZipType.ts';
declare const RepositoryApi: {
    getRepositoryDetails: ({ organization, gitRepositoryName, type, }: GetFileContentOptions) => Promise<RepositoryType | null>;
    getRepositoryBranches: ({ repoBranchesUrl, type, }: GetRepositoryBranchesOptions) => Promise<RepositoryBranchType[] | null>;
    getFileContent: ({ organization, gitRepositoryName, fileName, type, }: GetFileContentOptions) => Promise<unknown | null>;
    prepareGitBranchZipConfig: ({ zipBaseDir, application, branchName, }: ApplicationZipConfigOptions) => DownloadZipOptions | null;
};
export default RepositoryApi;

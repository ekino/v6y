import { ApplicationType } from './ApplicationType';

export interface ApplicationZipConfigOptions {
    application: ApplicationType;
    zipBaseDir: string;
    branchName: string;
}

export interface DownloadZipOptions {
    zipSourceUrl: string;
    zipDestinationDir: string;
    zipFileName: string;
    zipOptions?: {
        headers?: Record<string, string>;
    };
}

export interface ZipFileOptions {
    zipOriginalSourceDir?: string;
    zipOriginalFileName?: string;
    zipNewSourceDir?: string;
    zipDir?: string;
    zipDirFullPath?: string;
}

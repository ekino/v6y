import { DownloadZipOptions, ZipFileOptions } from '../types/ZipType.ts';
/**
 * Utilities for working with ZIP files.
 */
declare const ZipUtils: {
    downloadZip: ({ zipSourceUrl, zipDestinationDir, zipFileName, zipOptions, }: DownloadZipOptions) => Promise<boolean>;
    unZipFile: ({ zipOriginalSourceDir, zipOriginalFileName, zipNewSourceDir, }: ZipFileOptions) => Promise<string | null>;
    deleteZip: ({ zipDir, zipDirFullPath }: ZipFileOptions) => boolean;
    cleanZipWorkspace: (directoryPath: string) => Promise<void>;
};
export default ZipUtils;

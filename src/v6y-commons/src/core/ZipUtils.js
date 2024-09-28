import AdmZip from 'adm-zip';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'node:path';
import * as stream from 'node:stream';
import { promisify } from 'node:util';
import AppLogger from './AppLogger.ts';
const finished = promisify(stream.finished);
const __dirname = path.resolve();
/**
 * Recursively cleans up a workspace directory by deleting any empty subdirectories.
 * @param directoryPath
 */
const cleanZipWorkspace = async (directoryPath) => {
    try {
        const files = await fs.promises.readdir(directoryPath);
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = await fs.promises.stat(filePath);
            if (stats.isDirectory()) {
                await cleanZipWorkspace(filePath); // Recursively check subdirectories
                const subFiles = await fs.promises.readdir(filePath);
                if (subFiles.length === 0) {
                    await fs.promises.rmdir(filePath);
                }
            }
        }
    }
    catch (error) {
        AppLogger.info(`[ZipUtils - cleanZipWorkspace] 🚫 exception: ${error}`);
    }
};
/**
 *  Downloads a ZIP file from a specified URL to a specified directory.
 * @param zipSourceUrl
 * @param zipDestinationDir
 * @param zipFileName
 * @param zipOptions
 */
const downloadZip = async ({ zipSourceUrl, zipDestinationDir, zipFileName, zipOptions, }) => {
    try {
        AppLogger.info(`[ZipUtils - downloadZip] zipSourceUrl:  ${zipSourceUrl}`);
        AppLogger.info(`[ZipUtils - downloadZip] zipDestinationDir:  ${zipDestinationDir}`);
        AppLogger.info(`[ZipUtils - downloadZip] zipFileName:  ${zipFileName}`);
        if (!zipSourceUrl?.length || !zipDestinationDir?.length || !zipFileName?.length) {
            return false;
        }
        const zipOutDir = path.join(__dirname, zipDestinationDir);
        AppLogger.info(`[ZipUtils - downloadZip] zipOutDir:  ${zipOutDir}`);
        if (!fs.existsSync(zipOutDir)) {
            fs.mkdirSync(zipOutDir, {
                recursive: true,
            });
        }
        const zipOutFile = path.join(zipOutDir, zipFileName);
        AppLogger.info(`[ZipUtils - downloadZip] zipOutFile:  ${zipOutFile}`);
        const response = await axios({
            method: 'get',
            url: zipSourceUrl,
            responseType: 'stream',
            headers: zipOptions?.headers,
        });
        AppLogger.info(`[ZipUtils - downloadZip] get zipResponse`);
        const zipWriterStream = fs.createWriteStream(zipOutFile);
        AppLogger.info(`[ZipUtils - downloadZip] init zipWriterStream`);
        response.data.pipe(zipWriterStream);
        AppLogger.info(`[ZipUtils - downloadZip] pipe response on zipWriterStream`);
        await finished(zipWriterStream);
        AppLogger.info('[ZipUtils - downloadZip] 🎉 end of download');
        return true;
    }
    catch (error) {
        AppLogger.info(`[ZipUtils - downloadZip] 🚫 exception:  ${zipSourceUrl} / ${error}`);
        return false;
    }
};
const unZipFile = async ({ zipOriginalSourceDir, zipOriginalFileName, zipNewSourceDir, }) => {
    try {
        // Log the input parameters for debugging
        AppLogger.info(`[ZipUtils - unZipFile] zipOriginalSourceDir:  ${zipOriginalSourceDir}`);
        AppLogger.info(`[ZipUtils - unZipFile] zipOriginalFileName:  ${zipOriginalFileName}`);
        AppLogger.info(`[ZipUtils - unZipFile] zipNewSourceDir:  ${zipNewSourceDir}`);
        // Check if all required parameters are provided
        if (!zipOriginalSourceDir?.length ||
            !zipOriginalFileName?.length ||
            !zipNewSourceDir?.length) {
            return null;
        }
        // Construct the full path to the source directory
        const zipOriginalSourceDirPath = path.join(__dirname, zipOriginalSourceDir);
        AppLogger.info(`[ZipUtils - unZipFile] zipOriginalSourceDirPath:  ${zipOriginalSourceDirPath}`);
        // Check if the source directory exists
        if (!fs.existsSync(zipOriginalSourceDirPath)) {
            return null;
        }
        // Construct the full path to the zip file
        const zipOriginalFileNamePath = path.join(zipOriginalSourceDirPath, zipOriginalFileName);
        AppLogger.info(`[ZipUtils - downloadZip] zipOriginalFileNamePath:  ${zipOriginalFileNamePath}`);
        // Check if the zip file exists
        if (!fs.existsSync(zipOriginalFileNamePath)) {
            return null;
        }
        // Create an AdmZip instance for the zip file
        const originalZip = new AdmZip(zipOriginalFileNamePath);
        AppLogger.info('[ZipUtils - unZipFile] start unzipping file');
        // Construct the full path to the destination directory
        const zipNewSourceDirPath = path.join(__dirname, zipNewSourceDir);
        AppLogger.info(`[ZipUtils - unZipFile] zipNewSourceDirPath:  ${zipNewSourceDirPath}`);
        // Create the destination directory if it doesn't exist
        if (!fs.existsSync(zipNewSourceDirPath)) {
            fs.mkdirSync(zipNewSourceDirPath, { recursive: true });
        }
        // Extract the zip file to the destination directory
        originalZip.extractAllTo(zipNewSourceDirPath, true, false, '');
        // Clean up the original zip file
        deleteZip({
            zipDirFullPath: zipOriginalFileNamePath,
        });
        // Rename the extracted folder (handling potential single-folder extraction)
        const mvSource = path.join(zipNewSourceDirPath, fs.readdirSync(zipNewSourceDirPath)?.[0]);
        const mvDestination = `${zipNewSourceDirPath}-temp`;
        await fs.move(mvSource, mvDestination, { overwrite: false });
        await fs.promises.rename(mvDestination, mvDestination?.replace('-temp', ''));
        // Clean up any empty folders in the original source directory
        await cleanZipWorkspace(zipOriginalSourceDirPath);
        AppLogger.info('[ZipUtils - unZipFile] 🎉 end unzipping file');
        // Return the path to the extracted directory
        return zipNewSourceDirPath;
    }
    catch (error) {
        // Log any errors that occur during the unzipping process
        AppLogger.info(`🚫 [ZipUtils - unZipFile] error: ${zipOriginalFileName} / ${error}`);
        return null;
    }
};
/**
 * Deletes a ZIP file from the specified directory.
 * @param zipDir
 * @param zipDirFullPath
 */
const deleteZip = ({ zipDir, zipDirFullPath }) => {
    try {
        AppLogger.info(`[ZipUtils - deleteZip] zipDir:  ${zipDir}`);
        AppLogger.info(`[ZipUtils - deleteZip] zipDirFullPath:  ${zipDirFullPath}`);
        const zipDirPath = zipDirFullPath?.length
            ? zipDirFullPath
            : path.join(__dirname, zipDir || '');
        AppLogger.info(`[ZipUtils - deleteZip] zipDirPath:  ${zipDirPath}`);
        if (!fs.existsSync(zipDirPath)) {
            return true;
        }
        fs.rmSync(zipDirPath, {
            recursive: true,
            force: true,
        });
        AppLogger.info('[ZipUtils - deleteZip] 🎉 end of deleting zip file');
        return true;
    }
    catch (error) {
        AppLogger.info(`🚫 [ZipUtils - deleteZip] error:  ${zipDir} / ${error}`);
        return false;
    }
};
/**
 * Utilities for working with ZIP files.
 */
const ZipUtils = {
    downloadZip,
    unZipFile,
    deleteZip,
    cleanZipWorkspace,
};
export default ZipUtils;

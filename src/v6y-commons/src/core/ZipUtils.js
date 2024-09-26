"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adm_zip_1 = __importDefault(require("adm-zip"));
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const stream = __importStar(require("node:stream"));
const node_util_1 = require("node:util");
const AppLogger_1 = __importDefault(require("./AppLogger"));
const finished = (0, node_util_1.promisify)(stream.finished);
const __dirname = node_path_1.default.resolve();
/**
 * Recursively cleans up a workspace directory by deleting any empty subdirectories.
 * @param directoryPath
 */
const cleanZipWorkspace = async (directoryPath) => {
    try {
        const files = await fs_extra_1.default.promises.readdir(directoryPath);
        for (const file of files) {
            const filePath = node_path_1.default.join(directoryPath, file);
            const stats = await fs_extra_1.default.promises.stat(filePath);
            if (stats.isDirectory()) {
                await cleanZipWorkspace(filePath); // Recursively check subdirectories
                const subFiles = await fs_extra_1.default.promises.readdir(filePath);
                if (subFiles.length === 0) {
                    await fs_extra_1.default.promises.rmdir(filePath);
                }
            }
        }
    }
    catch (error) {
        AppLogger_1.default.info(`[ZipUtils - cleanZipWorkspace] 🚫 exception: ${error}`);
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
        AppLogger_1.default.info(`[ZipUtils - downloadZip] zipSourceUrl:  ${zipSourceUrl}`);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] zipDestinationDir:  ${zipDestinationDir}`);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] zipFileName:  ${zipFileName}`);
        if (!zipSourceUrl?.length || !zipDestinationDir?.length || !zipFileName?.length) {
            return false;
        }
        const zipOutDir = node_path_1.default.join(__dirname, zipDestinationDir);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] zipOutDir:  ${zipOutDir}`);
        if (!fs_extra_1.default.existsSync(zipOutDir)) {
            fs_extra_1.default.mkdirSync(zipOutDir, {
                recursive: true,
            });
        }
        const zipOutFile = node_path_1.default.join(zipOutDir, zipFileName);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] zipOutFile:  ${zipOutFile}`);
        const response = await (0, axios_1.default)({
            method: 'get',
            url: zipSourceUrl,
            responseType: 'stream',
            headers: zipOptions?.headers,
        });
        AppLogger_1.default.info(`[ZipUtils - downloadZip] get zipResponse`);
        const zipWriterStream = fs_extra_1.default.createWriteStream(zipOutFile);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] init zipWriterStream`);
        response.data.pipe(zipWriterStream);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] pipe response on zipWriterStream`);
        await finished(zipWriterStream);
        AppLogger_1.default.info('[ZipUtils - downloadZip] 🎉 end of download');
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`[ZipUtils - downloadZip] 🚫 exception:  ${zipSourceUrl} / ${error}`);
        return false;
    }
};
const unZipFile = async ({ zipOriginalSourceDir, zipOriginalFileName, zipNewSourceDir, }) => {
    try {
        // Log the input parameters for debugging
        AppLogger_1.default.info(`[ZipUtils - unZipFile] zipOriginalSourceDir:  ${zipOriginalSourceDir}`);
        AppLogger_1.default.info(`[ZipUtils - unZipFile] zipOriginalFileName:  ${zipOriginalFileName}`);
        AppLogger_1.default.info(`[ZipUtils - unZipFile] zipNewSourceDir:  ${zipNewSourceDir}`);
        // Check if all required parameters are provided
        if (!zipOriginalSourceDir?.length ||
            !zipOriginalFileName?.length ||
            !zipNewSourceDir?.length) {
            return null;
        }
        // Construct the full path to the source directory
        const zipOriginalSourceDirPath = node_path_1.default.join(__dirname, zipOriginalSourceDir);
        AppLogger_1.default.info(`[ZipUtils - unZipFile] zipOriginalSourceDirPath:  ${zipOriginalSourceDirPath}`);
        // Check if the source directory exists
        if (!fs_extra_1.default.existsSync(zipOriginalSourceDirPath)) {
            return null;
        }
        // Construct the full path to the zip file
        const zipOriginalFileNamePath = node_path_1.default.join(zipOriginalSourceDirPath, zipOriginalFileName);
        AppLogger_1.default.info(`[ZipUtils - downloadZip] zipOriginalFileNamePath:  ${zipOriginalFileNamePath}`);
        // Check if the zip file exists
        if (!fs_extra_1.default.existsSync(zipOriginalFileNamePath)) {
            return null;
        }
        // Create an AdmZip instance for the zip file
        const originalZip = new adm_zip_1.default(zipOriginalFileNamePath);
        AppLogger_1.default.info('[ZipUtils - unZipFile] start unzipping file');
        // Construct the full path to the destination directory
        const zipNewSourceDirPath = node_path_1.default.join(__dirname, zipNewSourceDir);
        AppLogger_1.default.info(`[ZipUtils - unZipFile] zipNewSourceDirPath:  ${zipNewSourceDirPath}`);
        // Create the destination directory if it doesn't exist
        if (!fs_extra_1.default.existsSync(zipNewSourceDirPath)) {
            fs_extra_1.default.mkdirSync(zipNewSourceDirPath, { recursive: true });
        }
        // Extract the zip file to the destination directory
        originalZip.extractAllTo(zipNewSourceDirPath, true, false, '');
        // Clean up the original zip file
        deleteZip({
            zipDirFullPath: zipOriginalFileNamePath,
        });
        // Rename the extracted folder (handling potential single-folder extraction)
        const mvSource = node_path_1.default.join(zipNewSourceDirPath, fs_extra_1.default.readdirSync(zipNewSourceDirPath)?.[0]);
        const mvDestination = `${zipNewSourceDirPath}-temp`;
        await fs_extra_1.default.move(mvSource, mvDestination, { overwrite: false });
        await fs_extra_1.default.promises.rename(mvDestination, mvDestination?.replace('-temp', ''));
        // Clean up any empty folders in the original source directory
        await cleanZipWorkspace(zipOriginalSourceDirPath);
        AppLogger_1.default.info('[ZipUtils - unZipFile] 🎉 end unzipping file');
        // Return the path to the extracted directory
        return zipNewSourceDirPath;
    }
    catch (error) {
        // Log any errors that occur during the unzipping process
        AppLogger_1.default.info(`🚫 [ZipUtils - unZipFile] error: ${zipOriginalFileName} / ${error}`);
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
        AppLogger_1.default.info(`[ZipUtils - deleteZip] zipDir:  ${zipDir}`);
        AppLogger_1.default.info(`[ZipUtils - deleteZip] zipDirFullPath:  ${zipDirFullPath}`);
        const zipDirPath = zipDirFullPath?.length
            ? zipDirFullPath
            : node_path_1.default.join(__dirname, zipDir || '');
        AppLogger_1.default.info(`[ZipUtils - deleteZip] zipDirPath:  ${zipDirPath}`);
        if (!fs_extra_1.default.existsSync(zipDirPath)) {
            return true;
        }
        fs_extra_1.default.rmSync(zipDirPath, {
            recursive: true,
            force: true,
        });
        AppLogger_1.default.info('[ZipUtils - deleteZip] 🎉 end of deleting zip file');
        return true;
    }
    catch (error) {
        AppLogger_1.default.info(`🚫 [ZipUtils - deleteZip] error:  ${zipDir} / ${error}`);
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
exports.default = ZipUtils;

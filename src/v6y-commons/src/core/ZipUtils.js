import AdmZip from 'adm-zip';
import axios from 'axios';
import Http from 'http';
import Https from 'https';
import fs from 'node:fs';
import path from 'node:path';
import * as stream from 'node:stream';
import { promisify } from 'node:util';

import AppLogger from './AppLogger.js';

const __dirname = path.resolve();
const finished = promisify(stream.finished);

const ZipHttpClient = axios.create({
    httpAgent: new Http.Agent({
        keepAlive: true,
    }),
    httpsAgent: new Https.Agent({
        keepAlive: true,
        rejectUnauthorized: false,
    }),
});

/**
 * Downloads a ZIP file from a given URL to a specified destination directory.
 *
 * @param {Object} params - Parameters for downloading the ZIP file.
 * @param {string} params.zipSourceUrl - The URL of the ZIP file to download.
 * @param {string} params.zipDestinationDir - The directory where the ZIP file should be saved.
 * @param {string} params.zipFileName - The name of the ZIP file to be saved.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the download is successful, `false` otherwise.
 * @async
 */
const downloadZip = async ({ zipSourceUrl, zipDestinationDir, zipFileName }) => {
    try {
        if (!zipSourceUrl?.length || !zipDestinationDir?.length || !zipFileName?.length) {
            return false;
        }

        AppLogger.info(`[downloadZip] zipSourceUrl:  ${zipSourceUrl}`);
        AppLogger.info(`[downloadZip] zipDestinationDir:  ${zipDestinationDir}`);
        AppLogger.info(`[downloadZip] zipFileName:  ${zipFileName}`);

        const zipOutDir = path.join(__dirname, zipDestinationDir);
        AppLogger.info(`[downloadZip] zipOutDir:  ${zipOutDir}`);

        if (!fs.existsSync(zipOutDir)) {
            fs.mkdirSync(zipOutDir, {
                recursive: true,
            });
        }

        const zipOutFile = path.join(zipOutDir, zipFileName);
        AppLogger.info(`[downloadZip] zipOutFile:  ${zipOutFile}`);

        // téléchargement de zip sous forme de stream pour éviter les soucis de mémoire
        const zipStreamWriter = fs.createWriteStream(zipOutFile);

        const response = await ZipHttpClient({
            method: 'get',
            url: zipSourceUrl,
            responseType: 'stream',
        });

        response?.data?.pipe?.(zipStreamWriter);

        await finished(zipStreamWriter);

        AppLogger.info('[downloadZip] fin de téléchargement du zip');

        return true;
    } catch (error) {
        AppLogger.info(`[downloadZip] exception:  ${error?.message}`);
        return false;
    }
};

/**
 * Unzips a ZIP file to the specified directory.
 *
 * @param {Object} params - Parameters for unzipping the file.
 * @param {string} params.zipDir - The directory where the ZIP file is located.
 * @param {string} params.zipFileName - The name of the ZIP file to unzip.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the unzip is successful, `false` otherwise.
 * @async
 */
const unZipFile = async ({ zipDir, zipFileName }) => {
    try {
        if (!zipDir?.length || !zipFileName?.length) {
            return false;
        }

        AppLogger.info(`[unZipFile] zipDir:  ${zipDir}`);
        AppLogger.info(`[unZipFile] zipFileName:  ${zipFileName}`);

        const zipOutDir = path.join(__dirname, zipDir);
        AppLogger.info(`[unZipFile] zipOutDir:  ${zipOutDir}`);

        if (!fs.existsSync(zipOutDir)) {
            return false;
        }

        const zipOutFile = path.join(zipOutDir, zipFileName);
        AppLogger.info(`[downloadZip] zipOutFile:  ${zipOutFile}`);

        if (!fs.existsSync(zipOutFile)) {
            return false;
        }

        const zip = new AdmZip(zipOutFile, null);
        AppLogger.info('[unZipFile] start unzipping file');

        zip.extractAllTo(zipOutDir, true, false, null);

        AppLogger.info('[unZipFile] end unzipping file');

        return true;
    } catch (error) {
        AppLogger.info(`[unZipFile] error:  ${error?.message}`);
        return false;
    }
};

/**
 * Deletes a ZIP file and its directory.
 *
 * @param {string} zipDir - The directory where the ZIP file is located.
 * @returns {boolean} `true` if the deletion is successful or the directory doesn't exist, `false` otherwise.
 */
const deleteZip = (zipDir) => {
    try {
        if (!zipDir?.length) {
            return null;
        }

        AppLogger.info(`[deleteZip] zipDir:  ${zipDir}`);

        const zipDirPath = path.join(__dirname, zipDir);
        AppLogger.info(`[unZipFile] zipDirPath:  ${zipDirPath}`);

        if (!fs.existsSync(zipDirPath)) {
            return true;
        }

        fs.rmSync(zipDirPath, {
            recursive: true,
            force: true,
        });

        return true;
    } catch (error) {
        AppLogger.info(`[deleteZip] error:  ${error?.message}`);
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
};

export default ZipUtils;

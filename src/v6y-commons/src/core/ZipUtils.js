import fs from 'node:fs';
import path from 'node:path';
import * as stream from 'node:stream';
import Https from 'https';
import Http from 'http';
import { promisify } from 'node:util';
import axios from 'axios';
import AdmZip from 'adm-zip';
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

const ZipUtils = {
    downloadZip,
    unZipFile,
    deleteZip,
};

export default ZipUtils;

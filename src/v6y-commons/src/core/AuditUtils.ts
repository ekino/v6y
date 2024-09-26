import crypto from 'crypto';
import fs from 'fs-extra';
import glob from 'globby';
import lodash from 'lodash';
import path from 'path';
import unixify from 'unixify';

import AppLogger from './AppLogger';

const __dirname = path.resolve();

/**
 * Checks if a file is an accepted file type.
 * @param {string} fileName - The name of the file.
 * @returns {boolean} - Returns true if the file is an accepted file type, false otherwise.
 */
const isAcceptedFileType = (fileName: string): boolean =>
    fileName?.endsWith('') ||
    fileName?.endsWith('.jsx') ||
    fileName?.endsWith('.ts') ||
    fileName?.endsWith('.tsx') ||
    false;

/**
 * Checks if a file is excluded.
 * @param {string} filePath - The path of the file.
 * @returns {boolean} - Returns true if the file is excluded, false otherwise.
 */
const isExcludedFile = (filePath: string): boolean =>
    filePath?.toLowerCase()?.includes('snap') ||
    filePath?.toLowerCase()?.includes('mock') ||
    filePath?.toLowerCase()?.includes('jest') ||
    filePath?.toLowerCase()?.includes('webpack') ||
    filePath?.toLowerCase()?.includes('public') ||
    filePath?.toLowerCase()?.includes('cypress') ||
    filePath?.toLowerCase()?.includes('gitlab') ||
    filePath?.toLowerCase()?.includes('deploy') ||
    filePath?.toLowerCase()?.includes('target') ||
    filePath?.toLowerCase()?.includes('node_modules') ||
    filePath?.toLowerCase()?.includes('report-complexity') ||
    filePath?.toLowerCase()?.includes('eslint') ||
    filePath?.toLowerCase()?.includes('babel') ||
    filePath?.toLowerCase()?.includes('husky') ||
    filePath?.toLowerCase()?.includes('postcss') ||
    filePath?.toLowerCase()?.includes('routes') ||
    filePath?.toLowerCase()?.includes('path') ||
    filePath?.toLowerCase()?.includes('dico') ||
    filePath?.toLowerCase()?.includes('redux') ||
    filePath?.toLowerCase()?.includes('/dist/') ||
    filePath?.toLowerCase()?.includes('/bff/') ||
    filePath?.toLowerCase()?.includes('/wsclient/') ||
    filePath?.toLowerCase()?.includes('/js/index') ||
    filePath?.toLowerCase()?.includes('/ts/index.ts') ||
    filePath?.toLowerCase()?.includes('test') ||
    filePath?.toLowerCase()?.includes('spec') ||
    filePath?.toLowerCase()?.endsWith('.d.ts') ||
    filePath?.toLowerCase()?.endsWith('.config') ||
    filePath?.toLowerCase()?.endsWith('.config.ts') ||
    filePath?.toLowerCase()?.includes('/types/') ||
    filePath?.toLowerCase()?.includes('type') ||
    filePath?.toLowerCase()?.includes('index') ||
    filePath?.toLowerCase()?.includes('dico') ||
    false;

/**
 * This asynchronous function reads a file and returns its content as a string.
 *
 * @param {string} filePath - The path to the file to be read.
 * @returns {Promise<string|null>} A promise that resolves to a string containing the file content, or null if an error occurs.
 *
 * @example
 * const content = await getAuditedFileContent('/path/to/file');
 * print(content); // Logs the content of the file.
 */
const getFileContent = async (filePath: string): Promise<string | null> => {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileStreamReader = fs.createReadStream(filePath);

        const chunks = [];

        for await (const chunk of fileStreamReader) {
            chunks.push(Buffer.from(chunk));
        }

        return Buffer.concat(chunks)?.toString('utf-8')?.trim();
    } catch (error) {
        AppLogger.info(`[AuditUtils - getFileContent] error:  ${error}`);
        return null;
    }
};

/**
 * This asynchronous function checks if a file contains a specific anti-pattern.
 *
 * @param {string} antiPattern - The anti-pattern to check for in the file.
 * @param {string} source - The file to check for the anti-pattern.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the file contains the anti-pattern.
 * If an error occurs, it logs the error message and returns false.
 *
 * @example
 * const result = await isNonCompliantFile('anti-pattern', '/path/to/file');
 * print(result); // Logs true if the file contains the anti-pattern, false otherwise.
 */
const isNonCompliantFile = async (antiPattern: string, source: string): Promise<boolean> => {
    try {
        if (!antiPattern?.length || !source?.length) {
            return false;
        }

        return source?.includes(antiPattern);
    } catch (error) {
        AppLogger.info(`[AuditUtils - isNonCompliantFile] error:  ${error}`);
        return false;
    }
};

/**
 * Finds the common base path among a list of files.
 * @param {string[]} files - The list of file paths.
 * @returns {string} - Returns the common base path.
 */
function findCommonBase(files: string[]): string {
    AppLogger.info(`[AuditUtils - findCommonBase] files:  ${files?.length}`);

    if (!files || files.length === 0 || files.length === 1) {
        return '';
    }

    const lastSlash = files[0].lastIndexOf(path.sep);
    AppLogger.info(`[AuditUtils - findCommonBase] lastSlash:  ${lastSlash}`);

    if (!lastSlash) {
        return '';
    }

    const first = files[0].substr(0, lastSlash + 1);
    AppLogger.info(`[AuditUtils - findCommonBase] first:  ${first}`);

    let prefixlen = first.length;
    AppLogger.info(`[AuditUtils - findCommonBase] prefixlen:  ${prefixlen}`);

    /**
     * Handles the prefixing of a file.
     * @param {string} file - The file to handle.
     */
    function handleFilePrefixing(file: string) {
        AppLogger.info(`[AuditUtils - findCommonBase] file:  ${file}`);

        for (let i = prefixlen; i > 0; i--) {
            if (file.substr(0, i) === first.substr(0, i)) {
                prefixlen = i;
                return;
            }
        }
        prefixlen = 0;
    }

    files.forEach(handleFilePrefixing);

    AppLogger.info(`[AuditUtils - findCommonBase] prefixlen:  ${prefixlen}`);

    return first.substr(0, prefixlen);
}

/**
 * Converts a pattern to a file.
 * @param {string} pattern - The pattern to convert.
 * @returns {Array} - Returns an array containing the files.
 */
const patternToFile = (pattern: string): Array<string> => glob.sync(unixify(pattern));

/**
 * This function retrieves files from a given source directory.
 *
 * @param {string} srcDir - The source directory from which to retrieve files.
 * @returns {Object} An object containing an array of files and the base path.
 * If an error occurs, it returns an object with an empty files array and null basePath.
 * @throws Will log the error message if one occurs.
 *
 * @example
 * const result = getFiles('/path/to/source/directory');
 * print(result.files); // Logs the array of files.
 * print(result.basePath); // Logs the base path.
 */
const getFiles = (srcDir: string): object | null => {
    try {
        AppLogger.info(`[AuditUtils - parseFiles] srcDir:  ${srcDir}`);

        if (!srcDir || !srcDir.length) {
            return null;
        }

        const files = lodash.chain([srcDir]).map(patternToFile).flatten().value();

        AppLogger.info(`[AuditUtils - parseFiles] files:  ${files?.length}`);

        const basePath = findCommonBase(files);

        return {
            files,
            basePath,
        };
    } catch (error) {
        AppLogger.info(`[AuditUtils - parseFiles] error:  ${error}`);

        return {
            files: [],
            basePath: null,
        };
    }
};

/**
 * Parses a file and returns relevant information.
 *
 * @param {string} file - The path to the file.
 * @param {string} basePath - The base path for all files.
 * @param {Object} options - The options for parsing.
 * @param {RegExp} [options.exclude] - A regular expression for files to exclude.
 * @param {boolean} [options.noempty] - Whether to skip empty lines.
 * @returns {Object|null} An object containing the file information, or null if the file is excluded or not a JavaScript/TypeScript file.
 */
const parseFile = (
    file: string,
    basePath: string,
    options: { exclude?: RegExp; noempty?: boolean },
): object | null => {
    AppLogger.info(`[AuditUtils - parseFile] file:  ${file}`);
    AppLogger.info(`[AuditUtils - parseFile] basePath:  ${basePath}`);
    AppLogger.info(`[AuditUtils - parseFile] options:  ${options}`);

    const mockPattern = /.*?(Mock).(js|jsx|ts|tsx)$/gi;
    const testPattern = /.*?(Test).(js|jsx|ts|tsx)$/gi;
    const nodeModulesPattern = /node_modules/g;
    const targetModulesPattern = /target/g;

    if (
        file &&
        ((options.exclude && file.match(options.exclude)) ||
            file.match(targetModulesPattern) ||
            file.match(mockPattern) ||
            file.match(testPattern) ||
            file.match(nodeModulesPattern))
    ) {
        AppLogger.info(`[AuditUtils - parseFile] excluded file:  ${file}`);
        return null;
    }

    if (!file.match(/\.(js|jsx|ts|tsx)$/)) {
        return null;
    }

    AppLogger.info(`[AuditUtils - parseFile] matched file:  ${file}`);

    const fileShort = file.replace(basePath, '');
    const fileSafe = fileShort.replace(/[^a-zA-Z0-9]/g, '_');

    AppLogger.info(`[AuditUtils - parseFile] fileShort:  ${fileShort}`);
    AppLogger.info(`[AuditUtils - parseFile] fileSafe:  ${fileSafe}`);

    let source = fs.readFileSync(file).toString();
    const trimmedSource = source.trim();

    if (!trimmedSource) {
        return null;
    }

    // if skip empty line option
    if (options.noempty) {
        source = source.replace(/^\s*[\r\n]/gm, '');
    }

    // if begins with shebang
    if (source[0] === '#' && source[1] === '!') {
        source = `//${source}`;
    }

    return {
        file,
        fileSafe,
        fileShort,
        source,
        options,
    };
};

/**
 * Generate Hash for value string
 * @param {string} value - Value to hashify
 * @returns {string | null}
 */
const generateHash = (value: string): string | null => {
    if (!value) {
        return null;
    }
    return crypto.createHash('md5').update(JSON.stringify(value)).digest('hex');
};

/**
 * Delete audit file
 * @param {string} filePath
 * @param {string} fileFullPath
 * @returns {boolean}
 */
const deleteAuditFile = ({
    filePath,
    fileFullPath,
}: {
    filePath: string;
    fileFullPath?: string;
}): boolean => {
    try {
        AppLogger.info(`[AuditUtils - deleteAuditFile] filePath:  ${filePath}`);
        AppLogger.info(`[AuditUtils - deleteAuditFile] fileFullPath:  ${fileFullPath}`);

        const fileDirPath = fileFullPath?.length ? fileFullPath : path.join(__dirname, filePath);
        AppLogger.info(`[AuditUtils - deleteAuditFile] fileDirPath:  ${fileDirPath}`);

        if (!fs.existsSync(fileDirPath)) {
            AppLogger.info(`[AuditUtils - deleteAuditFile] file not exist`);
            return true;
        }

        AppLogger.info(`[AuditUtils - deleteAuditFile] file exist`);

        fs.rmSync(fileDirPath, {
            recursive: true,
            force: true,
        });

        AppLogger.info('[AuditUtils - deleteAuditFile] 🎉 end of deleting zip file');

        return true;
    } catch (error) {
        AppLogger.info(
            `🚫 [AuditUtils - deleteAuditFile] error:  ${filePath || fileFullPath} / ${error}`,
        );
        return false;
    }
};

/**
 * Read directory files recursively
 * @param {string} directory
 * @param {Array} filesPaths
 * @return {*[]}
 */
const getFilesRecursively = (directory: string, filesPaths: string[]): string[] => {
    try {
        const files = fs.readdirSync(directory);

        filesPaths = filesPaths || [];

        files.forEach(function (file: string) {
            if (fs.statSync(directory + '/' + file).isDirectory()) {
                filesPaths = getFilesRecursively(directory + '/' + file, filesPaths);
            } else {
                filesPaths.push(path.join(directory, file));
            }
        });

        return filesPaths;
    } catch (error) {
        AppLogger.info(`[AuditUtils - getFilesRecursively] error:  ${error}`);
        return [];
    }
};

/**
 * Get audit eligible files
 * @param workspaceFolder
 */
const getAuditEligibleFiles = ({ workspaceFolder }: { workspaceFolder: string }) => {
    try {
        // read code repositories
        if (!workspaceFolder?.length) {
            return {};
        }

        AppLogger.info(`[AuditUtils - getAuditEligibleFiles] workspaceFolder: ${workspaceFolder}`);

        const workspaceFiles = getFilesRecursively(workspaceFolder, []);

        if (!workspaceFiles?.length) {
            return {};
        }

        const auditEligibleFiles = workspaceFiles.filter((filePath: string) => {
            const fileName = filePath?.split('/')?.reverse()?.[0];
            if (isAcceptedFileType(fileName) && !isExcludedFile(filePath)) {
                return filePath;
            }
            return null;
        });

        AppLogger.info(
            `[AuditUtils - getAuditEligibleFiles] auditEligibleFiles: ${auditEligibleFiles?.length}`,
        );

        return {
            auditEligibleFiles,
        };
    } catch (error) {
        AppLogger.info(`[AuditUtils - getAuditEligibleFiles] error:  ${error}`);
        return {};
    }
};

const AuditUtils = {
    isAcceptedFileType,
    isExcludedFile,
    getFiles,
    generateHash,
    parseFile,
    getFileContent,
    isNonCompliantFile,
    deleteAuditFile,
    getAuditEligibleFiles,
    getFilesRecursively,
};

export default AuditUtils;

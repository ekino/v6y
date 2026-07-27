import { existsSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Worker, WorkerOptions } from 'worker_threads';

/**
 * Resolve a worker entry point, accepting the TypeScript path used by callers.
 *
 * Callers reference sources (./src/workers/Foo.ts) because that is what exists
 * during development. A compiled deployment ships dist/ and no sources, so fall
 * back to the emitted JavaScript when the TypeScript file is absent.
 */
const resolveWorkerEntry = (filepath: string): string => {
    const absolutePath = path.isAbsolute(filepath)
        ? filepath
        : path.resolve(process.cwd(), filepath);

    if (existsSync(absolutePath)) {
        return absolutePath;
    }

    const compiledPath = absolutePath
        .replace(`${path.sep}src${path.sep}`, `${path.sep}dist${path.sep}`)
        .replace(/\.ts$/, '.js');

    // Returning the original path on a miss keeps the failure message pointing
    // at what the caller actually asked for.
    return existsSync(compiledPath) ? compiledPath : absolutePath;
};

/**
 * Fork a worker thread to run CPU intensive tasks.
 * @param filepath
 * @param workerData
 */
const forkWorker = (filepath: string, workerData: WorkerOptions['workerData']) => {
    return new Promise((resolve, reject) => {
        const absolutePath = resolveWorkerEntry(filepath);
        const targetUrl = pathToFileURL(absolutePath).href;
        // Only an uncompiled entry needs a TypeScript loader registered.
        const isTypeScriptEntry = absolutePath.endsWith('.ts');

        const worker = isTypeScriptEntry
            ? new Worker(
                  `import('tsx/esm/api').then(({ register }) => { register(); return import(${JSON.stringify(targetUrl)}); }).catch((e) => { console.error(e); process.exit(1); });`,
                  { eval: true, workerData },
              )
            : new Worker(absolutePath, { workerData });
        worker.on('online', () => {
            console.log('******************** Launching intensive CPU task ******************** ');
        });
        worker.on('message', (messageFromWorker) => {
            return resolve(messageFromWorker);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};

const WorkerHelper = {
    forkWorker,
};

export default WorkerHelper;

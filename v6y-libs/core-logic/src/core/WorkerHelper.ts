import path from 'path';
import { pathToFileURL } from 'url';
import { Worker, WorkerOptions } from 'worker_threads';

/**
 * Fork a worker thread to run CPU intensive tasks.
 * @param filepath
 * @param workerData
 */
const forkWorker = (filepath: string, workerData: WorkerOptions) => {
    return new Promise((resolve, reject) => {
        const absolutePath = path.isAbsolute(filepath)
            ? filepath
            : path.resolve(process.cwd(), filepath);
        const targetUrl = pathToFileURL(absolutePath).href;
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

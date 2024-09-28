import { Worker } from 'worker_threads';
/**
 * Fork a worker thread to run CPU intensive tasks
 * @param filepath
 * @param workerData
 */
const forkWorker = (filepath, workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(filepath, {
            workerData,
        });
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

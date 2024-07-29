import { Worker } from 'worker_threads';

/**
 * Use a worker via Worker Threads module to make intensive CPU task
 * @param {string} filepath string relative path to the file containing intensive CPU task code
 * @param {string | object | array | null} workerData
 * @return {Promise<unknown>} a promise that contains result from intensive CPU task
 */
const forkWorker = (filepath, workerData) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filepath, {
      workerData,
    });
    worker.on('online', () => {
      console.log(
        '******************** Launching intensive CPU task ******************** ',
      );
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

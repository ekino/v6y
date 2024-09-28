import { WorkerOptions } from 'worker_threads';
declare const WorkerHelper: {
    forkWorker: (filepath: string, workerData: WorkerOptions) => Promise<unknown>;
};
export default WorkerHelper;

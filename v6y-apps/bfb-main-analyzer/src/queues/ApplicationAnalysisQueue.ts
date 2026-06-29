export const APPLICATION_ANALYSIS_QUEUE = 'application-analysis';

export const APPLICATION_ANALYSIS_STARTUP_JOB = 'startup-analysis';
export const APPLICATION_ANALYSIS_SINGLE_JOB = 'application-analysis';

export const isApplicationAnalysisQueueEnabled = () => {
    return process.env.VITEST !== 'true' && process.env.NODE_ENV !== 'test';
};

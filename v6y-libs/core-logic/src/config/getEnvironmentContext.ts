export const getEnvironmentContext = (): 'development' | 'production' => {
    const execEnv = process?.argv;
    return execEnv?.includes('--dev') ? 'development' : 'production';
};

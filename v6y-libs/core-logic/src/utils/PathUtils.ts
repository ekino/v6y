const normalizeBasePath = (basePath?: string): string => {
    if (!basePath || basePath === '/') {
        return '/';
    }

    const leading = basePath.startsWith('/') ? '' : '/';
    const trailing = basePath.endsWith('/') ? '' : '/';

    return `${leading}${basePath}${trailing}`;
};

const PathUtils = {
    normalizeBasePath,
};

export { normalizeBasePath };
export default PathUtils;

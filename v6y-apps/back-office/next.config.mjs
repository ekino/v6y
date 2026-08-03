const workspaceRoot = new URL('../../', import.meta.url).pathname;

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Self-contained server bundle so the Docker runtime image needs no node_modules.
    output: 'standalone',
    outputFileTracingRoot: workspaceRoot,
    turbopack: {
        root: workspaceRoot,
    },
};

export default nextConfig;

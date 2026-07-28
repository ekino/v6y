import { fileURLToPath } from 'node:url';

import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
    analyzerMode: 'json',
    enabled: process.env.ANALYZE === 'true',
});

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: workspaceRoot,
    },
    experimental: {
        // Turbopack's dev persistent cache (.next/dev/cache) grows unbounded across
        // long-running local dev sessions (observed several GB) and inflates the
        // next-server process's resident memory. Disabling it only slows down warm
        // starts after a restart; incremental rebuilds within a running session are
        // unaffected. See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache
        turbopackFileSystemCacheForDev: false,
    },
    transpilePackages: ['@refinedev/antd'],
    webpack(config, { isServer }) {
        if (!isServer) {
            config.externals = [...config.externals, 'globby'];
            config.resolve = {
                ...config.resolve,
                fallback: {
                    net: false,
                    dns: false,
                    tls: false,
                    assert: false,
                    path: false,
                    fs: false,
                    events: false,
                    worker_threads: false,
                    process: false,
                },
            };
        }
        return config;
    },
};

export default withBundleAnalyzer(nextConfig);

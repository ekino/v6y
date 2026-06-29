import { fileURLToPath } from 'node:url';

import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
    analyzerMode: 'json',
    enabled: process.env.ANALYZE === 'true',
});

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));
const bffProxyTarget = process.env.NEXT_PUBLIC_V6Y_BFF_PATH || 'http://localhost:4001/v6y/graphql/';

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: workspaceRoot,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/v6y/graphql',
                destination: bffProxyTarget,
            },
            {
                source: '/v6y/graphql/:path*',
                destination: `${bffProxyTarget}:path*`,
            },
        ];
    },
    transpilePackages: [
        '@v6y/core-logic',
        '@v6y/ui-kit',
        '@v6y/ui-kit-front',
    ],
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

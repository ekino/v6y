import { fileURLToPath } from 'node:url';

import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
    analyzerMode: 'json',
    enabled: process.env.ANALYZE === 'true',
});

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));

// Server-side only: where this app's /v6y/graphql rewrite forwards to. It is a
// private, internal address and must stay distinct from NEXT_PUBLIC_V6Y_BFF_PATH,
// which is the browser-facing endpoint used by ui-kit and front-bo. Sharing one
// variable for both broke any deployment where the two addresses differ.
//
// NEXT_PUBLIC_V6Y_BFF_PATH is still honoured as a fallback, but only when it holds
// an absolute URL, so deployments configured before V6Y_BFF_PROXY_TARGET existed
// keep working while a relative browser path is never used as a rewrite target.
const legacyBffProxyTarget = process.env.NEXT_PUBLIC_V6Y_BFF_PATH;
const bffProxyTarget =
    process.env.V6Y_BFF_PROXY_TARGET ||
    (/^https?:\/\//i.test(legacyBffProxyTarget ?? '') ? legacyBffProxyTarget : undefined) ||
    'http://localhost:4001/v6y/graphql/';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Self-contained server bundle so the Docker runtime image needs no node_modules.
    output: 'standalone',
    outputFileTracingRoot: workspaceRoot,
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

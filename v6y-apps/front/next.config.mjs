import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true,
            },
        ];
    },
    transpilePackages: [],
    webpack(config, { isServer }) {
        if (!isServer) {
            config.externals = [...config.externals, 'globby', 'sequelize'];
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

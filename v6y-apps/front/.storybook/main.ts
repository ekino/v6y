import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  viteFinal: async (config) => {
    return {
      ...config,
      define: {
        ...config.define,
        process: {
            env: {

            },
        },
      },
      resolve: {
        ...(config?.resolve || {}),
        alias: [
          // keep existing aliases
          ...(Array.isArray(config?.resolve?.alias) ? config.resolve.alias : []),
          { find: 'next/navigation', replacement: require('path').resolve(__dirname, './nextNavigationMock.ts') },
        ],
      },
    };
  },
};

export default config;

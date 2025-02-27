import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async viteFinal(config, { configType }) {
        return mergeConfig(config, {
            define: { 'process.env': {} },
        });
    },
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-onboarding',
        '@chromatic-com/storybook',
        '@storybook/experimental-addon-test',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
};

export default config;

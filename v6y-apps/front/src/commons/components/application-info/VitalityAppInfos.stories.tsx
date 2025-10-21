/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityAppInfos from './VitalityAppInfos';

const meta: Meta = { component: VitalityAppInfos as any, title: 'Commons/ApplicationInfo/VitalityAppInfos' };
export default meta;

type Story = StoryObj<typeof meta>;

const mockApp = {
	_id: 'app-1',
	name: 'Demo App',
	description: 'This is a demo application used for Storybook stories.',
	links: [{ label: 'Homepage', value: 'https://example.com' }],
	repo: { organization: 'ExampleOrg', webUrl: 'https://github.com/example', allBranches: [] },
	contactMail: 'team@example.com',
};

export const Default: Story = {
	args: {
		app: mockApp,
		source: undefined,
		canOpenDetails: true,
	},
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityHelpView from './VitalityHelpView';

const meta: Meta = { component: VitalityHelpView as any, title: 'Commons/Help/VitalityHelpView' };
export default meta;

type Story = StoryObj<typeof meta>;

const mockModule = {
	auditHelp: {
		category: 'Security',
		title: 'Vulnerabilities found',
		description: 'Several issues related to outdated dependencies were detected.',
		explanation: 'Update your dependencies and fix vulnerable code paths to reduce risk.',
	},
	branch: 'main',
	path: '/src/components/auth',
};

export const Default: Story = { render: () => <VitalityHelpView module={mockModule as any} /> };

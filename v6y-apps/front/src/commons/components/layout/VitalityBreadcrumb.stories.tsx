/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityBreadcrumb from './VitalityBreadcrumb';
import { setMockPath, setMockSearch } from '../../../../.storybook/nextNavigationMock';

const meta: Meta = { component: VitalityBreadcrumb as any, title: 'Commons/Layout/VitalityBreadcrumb' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		setMockPath('/app-list');
		setMockSearch('');
		return <VitalityBreadcrumb />;
	},
};

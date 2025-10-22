import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalityAppsStatsView from './VitalityAppsStatsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta = { component: VitalityAppsStatsView, title: 'Features/AppsStats/VitalityAppsStatsView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const qc = new QueryClient();
		return (
			<QueryClientProvider client={qc}>
				<VitalityAppsStatsView />
			</QueryClientProvider>
		);
	},
};

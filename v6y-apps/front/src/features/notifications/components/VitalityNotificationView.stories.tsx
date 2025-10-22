import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalityNotificationView from './VitalityNotificationView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta = { component: VitalityNotificationView, title: 'Features/Notifications/VitalityNotificationView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const qc = new QueryClient();
		return (
			<QueryClientProvider client={qc}>
				<VitalityNotificationView />
			</QueryClientProvider>
		);
	},
};

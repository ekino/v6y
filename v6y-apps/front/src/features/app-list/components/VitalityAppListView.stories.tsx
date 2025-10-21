import type { Meta, StoryObj } from '@storybook/react';
import VitalityAppListView from './VitalityAppListView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta = { component: VitalityAppListView, title: 'Features/AppList/VitalityAppListView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const qc = new QueryClient();
		return (
			<QueryClientProvider client={qc}>
				<VitalityAppListView />
			</QueryClientProvider>
		);
	},
};

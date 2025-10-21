/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalitySelectableIndicators from './VitalitySelectableIndicators';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta = { component: VitalitySelectableIndicators as any, title: 'Commons/Indicators/VitalitySelectableIndicators' };
export default meta;

type Story = StoryObj<typeof meta>;

const qc = new QueryClient();
qc.setQueryData(['getIndicatorListByParams'], {
	getApplicationDetailsKeywordsByParams: [
		{ label: 'performance' },
		{ label: 'security' },
	],
});

export const Default: Story = {
	render: () => (
		<QueryClientProvider client={qc}>
			<VitalitySelectableIndicators />
		</QueryClientProvider>
	),
};

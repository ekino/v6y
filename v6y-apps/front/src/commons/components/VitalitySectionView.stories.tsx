import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalitySectionView from './VitalitySectionView';

const meta: Meta = { component: VitalitySectionView, title: 'Commons/VitalitySectionView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<VitalitySectionView
			isLoading={false}
			isEmpty={false}
			title="Section title"
			avatar={<span />}
		>
			<div>Content</div>
		</VitalitySectionView>
	),
};

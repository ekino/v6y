import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalitySelectGrouperView from './VitalitySelectGrouperView';

const meta: Meta = { component: VitalitySelectGrouperView, title: 'Commons/VitalitySelectGrouperView' };
export default meta;

type Story = StoryObj<typeof meta>;

const dummyData = [{ id: '1', label: 'A' }, { id: '2', label: 'B' }];
export const Default: Story = {
	render: () => (
		<VitalitySelectGrouperView dataSource={dummyData} criteria={''} placeholder="Select" />
	),
};

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalityTabGrouperView from './VitalityTabGrouperView';

const meta: Meta = { component: VitalityTabGrouperView, title: 'Commons/VitalityTabGrouperView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityTabGrouperView dataSource={[]} criteria={''} /> };

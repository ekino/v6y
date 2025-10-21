import type { Meta, StoryObj } from '@storybook/react';
import VitalityDashboardView from './VitalityDashboardView';

const meta: Meta = { component: VitalityDashboardView, title: 'Features/Dashboard/VitalityDashboardView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityDashboardView /> };

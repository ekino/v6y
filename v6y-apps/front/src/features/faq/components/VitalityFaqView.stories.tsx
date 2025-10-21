import type { Meta, StoryObj } from '@storybook/react';
import VitalityFaqView from './VitalityFaqView';

const meta: Meta = { component: VitalityFaqView, title: 'Features/FAQ/VitalityFaqView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityFaqView /> };

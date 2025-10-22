import type { Meta, StoryObj } from '@storybook/react';
import VitalitySearchView from './VitalitySearchView';

const meta: Meta = { component: VitalitySearchView, title: 'Features/Search/VitalitySearchView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalitySearchView /> };

import type { Meta, StoryObj } from '@storybook/react';

import VitalitySearchBar from './VitalitySearchBar';

const meta: Meta<typeof VitalitySearchBar> = {
  component: VitalitySearchBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    helper: 'Search for applications',
    label: 'Search',
    placeholder: 'Enter search term',
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { EmptyView } from '@v6y/ui-kit';

const meta = {
    title: 'Organisms/EmptyView',
    component: EmptyView,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        message: { control: 'text' },
    },
} satisfies Meta<typeof EmptyView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultEmpty: Story = {
    args: {
        message: 'No data available',
    },
};

export const CustomMessageEmpty: Story = {
    args: {
        message: 'Custom empty state message',
    },
};

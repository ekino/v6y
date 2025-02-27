import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@v6y/ui-kit';

const meta = {
    title: 'Atoms/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: { control: 'select', options: ['default', 'primary', 'dashed', 'text', 'link'] },
        color: { control: 'color' },
        variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
        size: { control: 'select', options: ['small', 'middle', 'large'] },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' },
        block: { control: 'boolean' },
        onClick: { action: 'clicked' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        type: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        type: 'default',
        children: 'Secondary Button',
    },
};

export const Large: Story = {
    args: {
        size: 'large',
        children: 'Large Button',
    },
};

export const Small: Story = {
    args: {
        size: 'small',
        children: 'Small Button',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled Button',
    },
};

export const Loading: Story = {
    args: {
        loading: true,
        children: 'Loading Button',
    },
};

export const Block: Story = {
    args: {
        block: true,
        children: 'Block Button',
    },
};

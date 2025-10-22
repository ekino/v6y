/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityPageHeaderMenu from './VitalityPageHeaderMenu';

const meta: Meta = { component: VitalityPageHeaderMenu as any, title: 'Commons/Layout/VitalityPageHeaderMenu' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityPageHeaderMenu {...({} as any)} /> };

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityPageLayout from './VitalityPageLayout';

const meta: Meta = { component: VitalityPageLayout as any, title: 'Commons/Layout/VitalityPageLayout' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityPageLayout {...({} as any)} /> };

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityPageHeader from './VitalityPageHeader';

const meta: Meta = { component: VitalityPageHeader as any, title: 'Commons/Layout/VitalityPageHeader' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityPageHeader {...({} as any)} /> };

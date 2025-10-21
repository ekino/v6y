/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityModuleList from './VitalityModuleList';

const meta: Meta = { component: VitalityModuleList as any, title: 'Commons/Modules/VitalityModuleList' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityModuleList {...({} as any)} /> };

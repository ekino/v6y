/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityModuleListItem from './VitalityModuleListItem';

const meta: Meta = { component: VitalityModuleListItem as any, title: 'Commons/Modules/VitalityModuleListItem' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityModuleListItem {...({} as any)} /> };

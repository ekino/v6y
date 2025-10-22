/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react';
import VitalityBot from './VitalityBot';

const meta: Meta = { component: VitalityBot as any, title: 'Commons/Chatbot/VitalityBot' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityBot {...({} as any)} /> };

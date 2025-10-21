import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalityDependenciesView from './VitalityDependenciesView';

const meta: Meta = { component: VitalityDependenciesView, title: 'Features/AppDetails/Dependencies/VitalityDependenciesView' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityDependenciesView /> };

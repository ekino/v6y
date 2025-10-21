import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalityDependenciesStatusGrouper from './VitalityDependenciesStatusGrouper';

const meta: Meta = { component: VitalityDependenciesStatusGrouper, title: 'Features/AppDetails/Dependencies/VitalityDependenciesStatusGrouper' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityDependenciesStatusGrouper dependencies={[]} /> };

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import VitalityDependenciesBranchGrouper from './VitalityDependenciesBranchGrouper';

const meta: Meta = { component: VitalityDependenciesBranchGrouper, title: 'Features/AppDetails/Dependencies/VitalityDependenciesBranchGrouper' };
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <VitalityDependenciesBranchGrouper dependencies={[]} /> };

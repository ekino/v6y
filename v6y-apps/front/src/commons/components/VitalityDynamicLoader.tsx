import { VitalityLoader } from '@v6y/shared-ui';
import dynamic, { DynamicOptions } from 'next/dynamic';
import * as React from 'react';

interface DynamicComponentProps {
    [key: string]: unknown;
}

const VitalityLoading = () => <VitalityLoader />;

const VitalityDynamicLoader = (component: () => Promise<unknown>) =>
    dynamic(component as DynamicOptions, {
        loading: VitalityLoading,
    }) as React.ComponentType<DynamicComponentProps>;

export default VitalityDynamicLoader;

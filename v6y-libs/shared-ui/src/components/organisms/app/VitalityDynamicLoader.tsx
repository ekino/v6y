import dynamic, { DynamicOptions } from 'next/dynamic';
import * as React from 'react';

import VitalityLoader from './VitalityLoader';

interface DynamicComponentProps {
    [key: string]: unknown;
}

const VitalityLoading = () => <VitalityLoader />;

const VitalityDynamicLoader = (component: () => Promise<unknown>) =>
    dynamic(component as DynamicOptions, {
        loading: VitalityLoading,
    }) as React.ComponentType<DynamicComponentProps>;

export default VitalityDynamicLoader;

import dynamic, { DynamicOptions } from 'next/dynamic';
import * as React from 'react';

import { DynamicLoaderType } from '../../types/DynamicLoaderType';
import LoaderView from './LoaderView.tsx';

const ControlledLoading = () => <LoaderView />;

const DynamicLoader = (component: () => Promise<unknown>) =>
    dynamic(component as DynamicOptions, {
        loading: ControlledLoading,
    }) as React.ComponentType<DynamicLoaderType>;

export default DynamicLoader;

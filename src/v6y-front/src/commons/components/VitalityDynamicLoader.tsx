import React from "react"
import dynamic, { DynamicOptions } from 'next/dynamic';

interface DynamicComponentProps {
    [key: string]:  unknown; 
}

import VitalityLoader from "./VitalityLoader";

const VitalityLoading = () => <VitalityLoader />;

const VitalityDynamicLoader = (component: () => Promise<unknown>) => dynamic(component as DynamicOptions, { loading: VitalityLoading }) as React.ComponentType<DynamicComponentProps>


export default VitalityDynamicLoader;
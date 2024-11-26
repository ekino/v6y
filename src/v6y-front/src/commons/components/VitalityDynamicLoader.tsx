import React from "react"
import dynamic, { DynamicOptions } from 'next/dynamic';

import VitalityLoader from "./VitalityLoader";


const VitalityLoading = () => <VitalityLoader />;

const VitalityDynamicLoader = (component: () => Promise<unknown>) => dynamic(component as DynamicOptions, { loading: VitalityLoading })


export default VitalityDynamicLoader;
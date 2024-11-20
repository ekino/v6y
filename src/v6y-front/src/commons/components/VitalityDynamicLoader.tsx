import React,  { FC } from 'react';
import dynamic from 'next/dynamic';
import VitalityLoader from './VitalityLoader';

interface DynamicComponentProps {
    [key: string]:  unknown; 
}

const VitalityDynamicLoader = (importPath: string) => {

    const VitalityLoading = () => <VitalityLoader />;

    const Component = dynamic(() => import(importPath), {
        loading: VitalityLoading,
    });

    const DynamicComponent: FC<DynamicComponentProps> = (props) => <Component {...props} />;
    

    return DynamicComponent;
};

export default VitalityDynamicLoader;

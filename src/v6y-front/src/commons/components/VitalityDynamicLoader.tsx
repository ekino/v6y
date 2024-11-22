import {buildPathConfig} from '../config/VitalityPathConfig';

interface DynamicComponentProps {
    [key: string]:  unknown; 
}


const DynamicComponent = (path : string) => buildPathConfig(path);

const VitalityDynamicLoader = (path: string): React.ComponentType<DynamicComponentProps> => {
    return DynamicComponent(path);
}

export default VitalityDynamicLoader;
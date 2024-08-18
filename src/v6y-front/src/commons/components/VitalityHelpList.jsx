import React from 'react';

import { formatHelpOptions } from '../config/VitalityCommonConfig.js';
import VitalityCollapse from './VitalityCollapse.jsx';

const VitalityHelpList = ({ helps }) => {
    const dataSource = formatHelpOptions(helps);
    return <VitalityCollapse accordion bordered dataSource={dataSource} />;
};

export default VitalityHelpList;

import { Empty } from 'antd';
import * as React from 'react';

import VitalityText from '../VitalityText/VitalityText.tsx';

const VitalityEmptyView = ({ message }: { message?: string }) => (
    <Empty description={<VitalityText text={message || 'No data'} />} />
);

export default VitalityEmptyView;

import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText/VitalityText';
import { Empty } from 'antd';
import * as React from 'react';

import VitalityTerms from '../config/VitalityTerms';

const VitalityEmptyView = ({ message }: { message?: string }) => (
    <Empty
        description={<VitalityText text={message || VitalityTerms.VITALITY_EMPTY_DATA_MESSAGE} />}
    />
);

export default VitalityEmptyView;

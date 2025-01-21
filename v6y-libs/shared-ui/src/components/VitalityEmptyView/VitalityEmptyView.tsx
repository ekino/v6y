import { Empty } from 'antd';
import * as React from 'react';

import VitalityTerms from '../../../../core-logic/src/config/VitalityTerms';
import { VitalityText } from '../VitalityText/VitalityText';

const VitalityEmptyView = ({ message }: { message?: string }) => (
    <Empty
        description={<VitalityText text={message || VitalityTerms.VITALITY_EMPTY_DATA_MESSAGE} />}
    />
);

export default VitalityEmptyView;

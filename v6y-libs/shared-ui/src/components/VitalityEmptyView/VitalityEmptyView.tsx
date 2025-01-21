import { Empty } from 'antd';
import * as React from 'react';


import { VitalityText } from '../VitalityText/VitalityText';
import VitalityTerms from '../../../../core-logic/src/config/VitalityTerms';

const VitalityEmptyView = ({ message }: { message?: string }) => (
    <Empty
        description={<VitalityText text={message || VitalityTerms.VITALITY_EMPTY_DATA_MESSAGE} />}
    />
);

export default VitalityEmptyView;

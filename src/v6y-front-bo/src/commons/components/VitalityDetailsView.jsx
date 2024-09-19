import { Descriptions, Typography } from 'antd';
import React from 'react';

import VitalityMessageView from './VitalityMessageView.jsx';


const VitalityDetailsView = ({ details, error }) => (
    <>
        {(error || !Object.keys(details || {})?.length) && <VitalityMessageView error={error} />}
        {details && (
            <Descriptions bordered size="middle" column={1}>
                {Object.keys(details).map((itemKey, index) => (
                    <Descriptions.Item key={`${itemKey}-${index}`} label={itemKey}>
                        <Typography.Text>{details[itemKey]}</Typography.Text>
                    </Descriptions.Item>
                ))}
            </Descriptions>
        )}
    </>
);

export default VitalityDetailsView;

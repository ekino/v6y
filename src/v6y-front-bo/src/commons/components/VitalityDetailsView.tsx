import { HttpError } from '@refinedev/core';
import { Descriptions, Typography } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';

import VitalityMessageView from './VitalityMessageView';

const VitalityDetailsView = ({
    details,
    error,
}: {
    details: Record<string, string | ReactNode>;
    error: HttpError | string | undefined;
}) => {
    if (error || !Object.keys(details || {})?.length) {
        return <VitalityMessageView type="error" />;
    }

    return (
        <Descriptions bordered size="middle" column={1}>
            {Object.keys(details).map((itemKey, index) => (
                <Descriptions.Item key={`${itemKey}-${index}`} label={itemKey}>
                    <Typography.Text>{details[itemKey]}</Typography.Text>
                </Descriptions.Item>
            ))}
        </Descriptions>
    );
};

export default VitalityDetailsView;

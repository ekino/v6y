import { HttpError } from '@refinedev/core';
import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText/VitalityText';
import { Descriptions } from 'antd';
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
                    <VitalityText text={details[itemKey] as string} />
                </Descriptions.Item>
            ))}
        </Descriptions>
    );
};

export default VitalityDetailsView;

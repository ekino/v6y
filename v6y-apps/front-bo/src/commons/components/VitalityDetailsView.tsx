import * as React from 'react';
import { ReactNode } from 'react';

import { AdminHttpError } from '@v6y/ui-kit/api/types/AdminHttpError';
import Descriptions from '@v6y/ui-kit/components/atoms/app/Descriptions';
import TextView from '@v6y/ui-kit/components/organisms/app/TextView.tsx';

import VitalityMessageView from './VitalityMessageView';

const VitalityDetailsView = ({
    details,
    error,
}: {
    details: Record<string, string | ReactNode>;
    error?: AdminHttpError | string;
}) => {
    if (error || !Object.keys(details || {})?.length) {
        return <VitalityMessageView type="error" />;
    }

    return (
        <Descriptions bordered size="middle" column={1}>
            {Object.keys(details).map((itemKey, index) => (
                <Descriptions.Item key={`${itemKey}-${index}`} label={itemKey}>
                    <TextView content={details[itemKey] as string} />
                </Descriptions.Item>
            ))}
        </Descriptions>
    );
};

export default VitalityDetailsView;

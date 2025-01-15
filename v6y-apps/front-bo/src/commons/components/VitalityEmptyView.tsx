import { VitalityText } from '@v6y/shared-ui/src/components/VitalityText';
import { Empty } from 'antd';
import * as React from 'react';

import { useTranslation } from '../../infrastructure/adapters/translation/TranslationAdapter';

const VitalityEmptyView = ({ message }: { message?: string }) => {
    const { translate } = useTranslation();
    return (
        <Empty
            description={
                <VitalityText text={message || translate('pages.error.empty-data') || ''} />
            }
        />
    );
};

export default VitalityEmptyView;

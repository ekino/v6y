import { Typography } from 'antd';
import * as React from 'react';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper';
import CreateOrEditApplication from '../apis/createOrEditApplication';

export default function VitalityApplicationCreateView() {
    const { translate } = useTranslation();
    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-applications.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                createFormAdapter: applicationCreateOrEditFormOutputAdapter,
                createQuery: CreateOrEditApplication,
                createQueryParams: {},
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}

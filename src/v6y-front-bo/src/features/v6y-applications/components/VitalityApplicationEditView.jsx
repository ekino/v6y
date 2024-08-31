import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormInAdapter,
    applicationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper.jsx';
import CreateOrEditApplication from '../apis/createOrEditApplication.js';
import GetApplicationDetails from '../apis/getApplicationDetails.js';

export default function VitalityApplicationEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-applications.titles.edit')}
                </Typography.Title>
            }
            queryOptions={{
                queryFormAdapter: applicationCreateOrEditFormInAdapter,
                query: GetApplicationDetails,
                queryResource: 'getApplicationDetailsByParams',
                queryParams: {
                    appId: id,
                },
            }}
            mutationOptions={{
                editFormAdapter: applicationCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditApplication,
                editQueryParams: {
                    appId: id,
                },
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}

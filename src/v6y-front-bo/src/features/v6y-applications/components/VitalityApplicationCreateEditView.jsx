import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import React from 'react';

import {
    applicationCreateEditItems,
    createOrEditFormInAdapter,
    createOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig.js';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter.js';
import RefineCreateWrapper from '../../../infrastructure/components/RefineCreateWrapper.jsx';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper.jsx';
import CreateOrEditApplication from '../apis/createOrEditApplication.js';
import GetAppDetailsInfosByParams from '../apis/getAppDetailsInfosByParams.js';

export default function VitalityApplicationCreateEditView({ mode }) {
    const { translate } = useTranslation();
    const { id } = useParsed();

    if (mode === 'edit') {
        return (
            <RefineEditWrapper
                title={
                    <Typography.Title level={2}>
                        {translate('v6y-applications.titles.edit')}
                    </Typography.Title>
                }
                queryOptions={{
                    queryFormAdapter: createOrEditFormInAdapter,
                    query: GetAppDetailsInfosByParams,
                    queryResource: 'getAppDetailsInfosByParams',
                    queryParams: {
                        appId: id,
                    },
                }}
                mutationOptions={{
                    editFormAdapter: createOrEditFormOutputAdapter,
                    editQuery: CreateOrEditApplication,
                    editQueryParams: {
                        appId: id,
                    },
                }}
                formItems={applicationCreateEditItems(translate)}
            />
        );
    }

    return (
        <RefineCreateWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-applications.titles.create')}
                </Typography.Title>
            }
            createOptions={{
                createFormAdapter: createOrEditFormOutputAdapter,
                createQuery: CreateOrEditApplication,
                createQueryParams: {
                    appId: id,
                },
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}

import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import * as React from 'react';

import {
    applicationCreateEditItems,
    applicationCreateOrEditFormInAdapter,
    applicationCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditApplication from '../apis/createOrEditApplication';
import GetApplicationDetails from '../apis/getApplicationDetails';

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
                queryFormAdapter: applicationCreateOrEditFormInAdapter as (
                    data: unknown,
                ) => Record<string, unknown>,
                query: GetApplicationDetails,
                queryResource: 'getApplicationDetailsInfoByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                resource: 'createOrEditApplication',
                editFormAdapter: applicationCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditApplication,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={applicationCreateEditItems(translate)}
        />
    );
}

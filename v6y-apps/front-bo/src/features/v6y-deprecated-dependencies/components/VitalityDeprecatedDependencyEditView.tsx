import { useParsed } from '@refinedev/core';
import { Typography } from 'antd';
import * as React from 'react';

import {
    deprecatedDependencyCreateEditItems,
    deprecatedDependencyCreateOrEditFormInAdapter,
    deprecatedDependencyCreateOrEditFormOutputAdapter,
} from '../../../commons/config/VitalityFormConfig';
import { useTranslation } from '../../../infrastructure/adapters/translation/TranslationAdapter';
import RefineEditWrapper from '../../../infrastructure/components/RefineEditWrapper';
import CreateOrEditDeprecatedDependency from '../apis/createOrEditDeprecatedDependency';
import GetDeprecatedDependencyDetailsByParams from '../apis/getDeprecatedDependencyDetailsByParams';

export default function VitalityDeprecatedDependencyEditView() {
    const { translate } = useTranslation();
    const { id } = useParsed();

    return (
        <RefineEditWrapper
            title={
                <Typography.Title level={2}>
                    {translate('v6y-deprecated-dependencies.titles.edit')}
                </Typography.Title>
            }
            queryOptions={{
                queryFormAdapter: deprecatedDependencyCreateOrEditFormInAdapter,
                query: GetDeprecatedDependencyDetailsByParams,
                queryResource: 'getDeprecatedDependencyDetailsByParams',
                queryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            mutationOptions={{
                editFormAdapter: deprecatedDependencyCreateOrEditFormOutputAdapter,
                editQuery: CreateOrEditDeprecatedDependency,
                editQueryParams: {
                    _id: parseInt(id as string, 10),
                },
            }}
            formItems={deprecatedDependencyCreateEditItems(translate)}
        />
    );
}
